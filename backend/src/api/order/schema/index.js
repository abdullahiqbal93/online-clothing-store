import * as z from "zod";

const { object, string, number, array, date, boolean } = z;


export const orderItemSchema = object({
    productId: string().min(1, { message: "Product ID is required" }),
    name: string().min(1, { message: "Product name is required" }),
    image: string().min(1, { message: "Product image URL is required" }),
    price: number().min(0, { message: "Price must be a positive number" }),
    salePrice: number().optional(),
    quantity: number().min(1, { message: "Quantity must be at least 1" }),
    size: string().optional(),
    color: string().optional(),
});

export const shippingAddressSchema = object({
    addressId: string().min(1, { message: "Address ID is required" }),
    address: string().min(1, { message: "Address is required" }),
    city: string().min(1, { message: "City is required" }),
    postalcode: string().min(1, { message: "Postal code is required" }),
    phone: string().min(1, { message: "Phone number is required" }),
});

export const orderSchema = object({
    userId: string().min(1, { message: "User ID is required" }),
    cartId: string().min(1, { message: "Cart ID is required" }),
    cartItems: array(orderItemSchema).nonempty({ message: "Order must have at least one item" }),
    shippingAddress: shippingAddressSchema,
    orderStatus: string().optional(),
    paymentMethod: string().min(1, { message: "Payment method is required" }),
    paymentStatus: string().optional(),
    totalAmount: number().min(0, { message: "Total amount must be a positive number" }),
    paymentId: string().optional(),
    payerId: string().optional(),
    refundAmount: number().optional(),
    refundDate: date().optional(),
    deletedFor: object({
        user: boolean().default(false),
        admin: boolean().default(false),
    }).optional(),
});

export const updateOrderSchema = orderSchema.partial().strict();
export const insertOrderSchema = orderSchema.strict();
