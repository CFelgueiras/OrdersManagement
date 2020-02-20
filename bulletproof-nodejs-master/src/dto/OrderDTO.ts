export interface OrderDTO{
  _id: string;
  id_product: string;
  quantity: number;
  orderStatus: string;
  deliveryDateRequested: Date;
  requestDate: Date;
}
