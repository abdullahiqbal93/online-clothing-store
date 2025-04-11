import { Schema, model, models } from "mongoose";

export const OrderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
        cartItems: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                salePrice: { type: Number },
                quantity: { type: Number, required: true, min: 1 },
                size: { type: String },
                color: { type: String },
            },
        ],
        shippingAddress: {
            addressId: { type: Schema.Types.ObjectId, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalcode: { type: String, required: true },
            phone: { type: String, required: true },
        },
        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        paymentMethod: { type: String, enum: ["card", "paypal", "cod", "stripe"], required: true },
        paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded", "partially-refunded"], default: "pending" },
        totalAmount: { type: Number, required: true },
        paymentId: { type: String },
        payerId: { type: String },
        refundAmount: { type: Number, default: 0, min: 0 },
        refundDate: { type: Date, default: null },
        deletedFor: {
            user: { type: Boolean, default: false },
            admin: { type: Boolean, default: false },
          },
    },
    { timestamps: { createdAt: "orderDate", updatedAt: "orderUpdateDate" } }
);

export const Order = models?.Order || model("Order", OrderSchema);
