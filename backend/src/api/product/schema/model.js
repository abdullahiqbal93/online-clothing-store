import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    reviewMessage: { type: String, required: true },
    reviewValue: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

export const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        brand: { type: String },
        images: { type: Array, required: true },
        totalStock: { type: Number, min: 0 },
        isActive: { type: Boolean, default: true },
        variants: [
            {
                size: { type: String },
                color: { type: String },
                stock: { type: Number, required: true, min: 0 }
            }
        ],
        reviews: [ReviewSchema],
        averageRating: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export const Product = models?.Product || model("Product", ProductSchema);
