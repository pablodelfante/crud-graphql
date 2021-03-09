import mongoose from 'mongoose';

export default function connect() {
    mongoose.connect('mongodb://localhost/graphql', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


    const db = mongoose.connection;
    db.on('error', ()=>console.log('>>>error al conectar'));
    db.once('open', function () {
        console.log('>>>db connected')
    });
}
