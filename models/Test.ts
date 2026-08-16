import mongoose, { Schema, models, model } from "mongoose";

export interface ITest {
  _id: string;
  testId: number;
  description: string;
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
  },
  { timestamps: true }
);

export const Test = models.Test || model<ITest>("Test", TestSchema);

export default Test as mongoose.Model<ITest>;