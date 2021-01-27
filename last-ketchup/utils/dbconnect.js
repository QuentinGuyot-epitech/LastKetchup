import mongoose from "mongoose"
// require('dotenv').config()



const connection = {}
async function dbconnect() {

        if (connection.isConnected) {
            return
        }
        const db = await mongoose.connect(process.env.MONGO_URI,
        { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
        connection.isConnected = db.connections[0].readyState;
        console.log(connection.isConnected);
}

export default dbconnect;