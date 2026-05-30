import mongoose from "mongoose";
import dns from 'dns'
import 'dotenv/config'

const connectToDb = async () => {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1'])
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB Connected successsfully.");
    } catch (err) {
        console.log(`Error connected to MongoDb: ${err.message}`);
        process.exit(1)
    }
}

export default connectToDb