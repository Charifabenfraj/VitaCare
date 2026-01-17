import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  address: string;
  phone: string;
  items: IOrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La quantité doit être au moins 1'],
  },
});

const OrderSchema: Schema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Le nom du client est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email du client est requis"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide'],
    },
    address: {
      type: String,
      required: [true, "L'adresse de livraison est requise"],
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (items: IOrderItem[]) {
          return items.length > 0;
        },
        message: 'La commande doit contenir au moins un produit',
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Le prix total ne peut pas être négatif'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
