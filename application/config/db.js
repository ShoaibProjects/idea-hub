import mongoose from 'mongoose';

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (global.mongoose.conn) {
        return global.mongoose.conn;
    }
    if (!global.mongoose.promise) {
        const opts = {
            bufferCommands: false,
        };
        global.mongoose.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => mongoose);
    }

    global.mongoose.conn = await global.mongoose.promise;
    console.log("New MongoDB connection established.");
    return global.mongoose.conn;
}

export default connectDB;