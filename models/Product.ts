import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  composition: string;
  price: number;
  image: string;
  categoryId: mongoose.Types.ObjectId;
  isPromotion: boolean;
  promotionPercentage: number;
  isPack: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La description du produit est requise'],
    },
    composition: {
      type: String,
      required: [true, 'La composition du produit est requise'],
    },
    price: {
      type: Number,
      required: [true, 'Le prix du produit est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    image: {
      type: String,
      required: [true, "L'image du produit est requise"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La catégorie du produit est requise'],
    },
    isPromotion: {
      type: Boolean,
      default: false,
    },
    promotionPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Le pourcentage de promotion ne peut pas être négatif'],
      max: [100, 'Le pourcentage de promotion ne peut pas dépasser 100'],
    },
    isPack: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 100,
      min: [0, 'Le stock ne peut pas être négatif'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for discounted price
ProductSchema.virtual('discountedPrice').get(function (this: IProduct) {
  if (this.isPromotion && this.promotionPercentage > 0) {
    return this.price * (1 - this.promotionPercentage / 100);
  }
  return this.price;
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
