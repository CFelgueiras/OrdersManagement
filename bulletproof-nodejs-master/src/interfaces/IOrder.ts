import { OrderStatus } from "./EOrderStatus";

export interface IOrder {
  _id: string;
  id_product: string;
  quantity: number;
  orderStatus: OrderStatus;
  deliveryDateRequested: Date;
  requestDate: Date;
}
