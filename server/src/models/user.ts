import mongoose, { Schema, Document } from "mongoose";

export interface IUser {
    name: string, 
    email: string,
    password: string
}

export interface IUserDocuement extends IUser, Document {};

export const userSchema = new Schema<IUserDocuement>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }
})


const User = mongoose.model<IUserDocuement>("User", userSchema);

export default User;