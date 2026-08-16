import mongoose, { Schema, models, model } from "mongoose";

export interface IPackage {
  _id: string;
  title: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  includedTests: string[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    discountedPrice: {
      type: Number,
      required: [true, "Discounted price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Price cannot be negative"],
    },
    includedTests: {
      type: [String],
      required: true,
      validate: {
        validator: (tests: string[]) => Array.isArray(tests) && tests.length > 0,
        message: "At least one included test is required",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Package = models.Package || model<IPackage>("Package", PackageSchema);

export default Package as mongoose.Model<IPackage>;