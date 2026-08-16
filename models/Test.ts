import mongoose, { Schema, models, model } from "mongoose";

export interface ITest {
  _id: string;
  testId: number;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<ITest>(
  {
    testId: {
      type: Number,
      required: [true, "Test ID is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
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

export const Test = models.Test || model<ITest>("Test", TestSchema);

export default Test as mongoose.Model<ITest>;