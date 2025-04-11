import { authenticatedUser, createUser, deleteUser, getUser, getUserById, loginUser, logoutUser, updateUser, updateUserPassword, requestPasswordReset, validateResetToken, resetPassword } from "@/api/user/controller";
import { loginSchema, updateUserSchema, userSchema, requestPasswordResetSchema, validateResetTokenSchema, resetPasswordSchema } from "@/api/user/schema/index";
import { createdByValues, updatedByValues } from "@/lib/middlewares/default-data";
import { userPasswordHashing, verifyUserToken } from "@/lib/middlewares/user-middleware";
import { validateRequestBody, validateRequestParams } from "@/lib/middlewares/validate";
import { getByIDSchemaParams } from "@/lib/shared-schema/index";
import { insertUserSchema } from '@/api/user/schema/';

export const user = (router) => {
    router.post(
        "/user",
        validateRequestBody(insertUserSchema),
        userPasswordHashing,
        createdByValues,
        createUser,
    );

    router.get("/user", verifyUserToken, getUser);
    
    router.put(
        "/user/change-password",
        verifyUserToken,
        updateUserPassword
    );

    router.get("/user/:id", validateRequestParams(getByIDSchemaParams), verifyUserToken, getUserById);

    router.put(
        "/user/:id",
        validateRequestParams(getByIDSchemaParams),
        validateRequestBody(updateUserSchema),
        verifyUserToken,
        updatedByValues,
        updateUser,
    );

    router.delete("/user/:id", validateRequestParams(getByIDSchemaParams), verifyUserToken, deleteUser);

    router.post("/login", validateRequestBody(loginSchema), loginUser);

    router.post("/logout", logoutUser);

    router.get("/check-auth", verifyUserToken, authenticatedUser);

    router.post("/forgot-password", validateRequestBody(requestPasswordResetSchema), requestPasswordReset);

    router.post("/validate-reset-token", validateRequestBody(validateResetTokenSchema), validateResetToken);

    router.post("/reset-password", validateRequestBody(resetPasswordSchema), resetPassword);

    return router;
};