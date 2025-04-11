
import { Schema, model, models } from "mongoose";
import { roles } from "@/api/user/schema/";

export const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        role: { type: String, enum: roles.Enum, default: "user" },
        avatar: { type: String },
        phoneNumber: { type: String, unique: true, sparse: true },
        isActive: { type: Boolean, default: true },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { timestamps: true }
);


UserSchema.methods.getByEmail = async function (email) {
    const user = await this.model("User").findOne({ email });
    return user ? user : null;
};

export const User = models?.User || model("User", UserSchema);
