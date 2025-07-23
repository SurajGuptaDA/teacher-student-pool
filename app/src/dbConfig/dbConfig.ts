import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Mondo DB connected Successfully');
        })

        connection.on('error', (err) => {
            console.log('MondoDb connection error. Please make sure MongoDB is running' + err);
            process.exit();
        })
    } catch (error) {
        console.log('Something goes wrong');
        console.log(error);
    }
}