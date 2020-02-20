import {Inject} from 'typedi';
import {OrderInputDTO} from '../dto/OderInputDTO';
import {OrderDTO} from '../dto/OrderDTO';

// create custom Repository class

export class OrderRepository {
  constructor(@Inject('orderModel') private orderModel: Models.OrderModel) {}

  public async findById(id: any) {
    return this.orderModel.findById(id);
  }

  public async update(orderDTO: OrderDTO) {
    return this.orderModel.findOneAndUpdate(
      { _id: orderDTO._id },
      {
        $set: {
          id_product: orderDTO.id_product,
          quantity: orderDTO.quantity,
          deliveryDateRequested: orderDTO.deliveryDateRequested,
        },
      },
      { new: true },
    );
  }

  public async updateStatus(orderDTO: OrderDTO) {
    return this.orderModel.findOneAndUpdate(
      { _id: orderDTO._id },
      { $set: { orderStatus: orderDTO.orderStatus } },
      { new: true },
    );
  }

  public async createOrder(orderInputDTO: OrderInputDTO) {
    return await this.orderModel.create({ ...orderInputDTO }).catch();
  }
}
