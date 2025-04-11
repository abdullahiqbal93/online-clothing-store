import { Schema, model, models } from "mongoose";

export const CartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
                color: { type: String },
                size: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export const Cart = models?.Cart || model("Cart", CartSchema);
