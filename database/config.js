const mongoose = require('mongoose');

const dbConnection = async () => {
    try {

        //me conecto a la bd
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false
        });

        console.log('BD Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar o iniciar la BD');
    }
}

module.exports = {
    dbConnection
}