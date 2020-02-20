import { IOrder } from '../interfaces/IOrder';
import mongoose from 'mongoose';

const Order = new mongoose.Schema(
  {
    id_product: {
      type: String,
      required: [true, 'Please enter a id of product'],
      index: true,
    },

    quantity: {
      type: Number,
      required: [true, 'Please enter a quantity of product'],
      index: true,
    },

    orderStatus: {
      type: String,
      enum: ['registeredOrder', 'inWait', 'stockOff', 'inProduction', 'paking', 'readyToDelivery', 'calceled'],
      default: 'registeredOrder',
    },

    deliveryDateRequested:{
      type: Date,
      required: [true, 'Please enter a estimeted request date']
    },

    requestDate:{
      type: Date,
      default: Date.now
    },
  },

  { timestamps: true },
);

export default mongoose.model<IOrder & mongoose.Document>('Order', Order);
