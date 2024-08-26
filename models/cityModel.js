import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
      unique: true,
    },
    population: {
      type: "String",
      required: true,
    },
    country: {
      type: "String",
      required: true,
    },
    latitude: {
        type: "Number",
        required: true,
    },
    longitude: {
        type: "Number",
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const City = mongoose.model("city", citySchema);