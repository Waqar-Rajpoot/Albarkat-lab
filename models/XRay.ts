import mongoose, { Schema, models, model } from "mongoose";

export interface IXRay {
  _id: string;
  category: string;
  procedure: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const XRaySchema = new Schema<IXRay>(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    procedure: {
      type: String,
      required: [true, "Procedure name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { timestamps: true }
);

export const XRay = models.XRay || model<IXRay>("XRay", XRaySchema);

export default XRay as mongoose.Model<IXRay>;