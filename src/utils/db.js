import mongoose from "mongoose";

const connect = async () =>{
    if(mongoose.connections[0].readyState) return;

    try{
        await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connection successful!!!")
    }catch(error){
        throw new Error("Error connecting to mongoose")
    }
}

export default connect;