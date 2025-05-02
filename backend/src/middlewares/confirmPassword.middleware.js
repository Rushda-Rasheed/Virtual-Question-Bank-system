
import { ApiError } from "../utils/ApiError.js";

export const validateConfirmPassword = (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return next(new ApiError(400, "Password and confirm password do not match"));
    }

    next();
};
