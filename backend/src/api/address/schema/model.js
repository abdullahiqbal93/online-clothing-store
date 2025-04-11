import { Schema, model, models } from "mongoose";

export const AddressSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalcode: { type: String, required: true },
        phone: { type: String, required: true },
    },
    { timestamps: true }
);

export const Address = models?.Address || model("Address", AddressSchema);
