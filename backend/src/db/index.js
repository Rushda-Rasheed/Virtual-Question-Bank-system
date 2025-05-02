import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { validateConfirmPassword } from "../middlewares/confirmPassword.middleware.js";



const connectDB = async () => {
    try {
        const url = new URL(process.env.MONGODB_URI)
        const connectionInstance = await mongoose.connect(`${url.href}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB
