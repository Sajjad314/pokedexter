import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type:String,
            required: false,
        },
        email: {
            type:String,
            unique:true,
            required: true,
        },
        phone: {
            type:String,
            required: false,
        },
        password: {
            type:String,
            required: false,
        },
        favorites: [{ type: Schema.Types.ObjectId, ref: 'Pokemon' }]
    }
);

export default mongoose.models.User || mongoose.model("User", userSchema);