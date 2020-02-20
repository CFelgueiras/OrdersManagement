import { Inject } from "typedi";
import { UserInputDTO } from "../dto/UserInputDTO";
import { UserDTO } from "../dto/UserDTO";

// create custom Repository class

export class UserRepository{
    constructor(
      @Inject('userModel') private UserModel : Models.UserModel
    ){}

    public async findById(id: any){
      return await this.UserModel.findById(id);
    }

    public async findByEmail(email: string){
      return await this.UserModel.findOne({ email });
    }

    public async update(userDTO: UserDTO){
      return await this.UserModel.findOneAndUpdate({ _id: userDTO._id}, { $set: { name: userDTO.name, address: userDTO.address, role: userDTO.role }}, {new: true} );
    }

    public async createUser(userInputDTO: UserInputDTO, buffer: Buffer, hashedPassword: string){
      const userRecord = await this.UserModel.create({
        ...userInputDTO,
        salt: buffer.toString('hex'),
        password: hashedPassword,
      }).catch();

      return userRecord;
    }
}
