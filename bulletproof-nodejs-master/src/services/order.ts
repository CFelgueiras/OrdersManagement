import { OrderRepository } from '../repository/orderRepository';
import { Service, Inject,  } from 'typedi';
import { OrderInputDTO } from '../dto/OderInputDTO';
import { OrderDTO } from '../dto/OrderDTO';
import { HttpRequest } from '../httpRequest/masterProduction';

@Service()
export default class OrderService {
  constructor(
      private orderRepository: OrderRepository,
      @Inject('logger') private logger
  ) {}

  public async FindById(id: string){
    try{
      const orderRecord = await this.orderRepository.findById(id);

      return orderRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async Create(orderInputDTO: OrderInputDTO) {
    try {
      if (orderInputDTO.quantity == 0){
        throw new TypeError('Quantity not be zero');
      }

      if (!new HttpRequest('product', orderInputDTO.id_product).get) {
        throw new Error('Product do not exist');
      }

      this.logger.silly('Creating order db record');
      const orderRecord = await this.orderRepository.createOrder(orderInputDTO);

      if (!orderRecord) {
        throw new Error('Order cannot be update');
      }

      const order = orderRecord.toObject();
      return order;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async Update(orderDTO: OrderDTO) {
    try {
      if(orderDTO.quantity == 0){
        throw new TypeError('Quantity not be zero');
      }
      this.logger.silly('Updating user db record');
      const orderRecord = await this.orderRepository.update(orderDTO);

      if (!orderRecord) {
        throw new Error('Order cannot be update');
      }

      const order = orderRecord.toObject();
      return order;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async UpdateStatus(orderDTO: OrderDTO) {
    try {

      this.logger.silly('Creating user db record');
      const orderRecord = await this.orderRepository.updateStatus(orderDTO);

      if (!orderRecord) {
        throw new Error('User cannot be update');
      }

      const order = orderRecord.toObject();
      return order;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
