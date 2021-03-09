import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const peopleSchema = new Schema({
    name:String,
    surname:String,
    age:Number
});

export default model('People', peopleSchema);