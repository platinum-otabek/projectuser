const mongoose = require('mongoose');
const config = require('../config/database');
module.exports = () => {

    mongoose.connect(config.database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false
    });
    const db = mongoose.connection;
    db.once('open', () => {
        console.log("Mongo DB is Connected");
    });
    db.on('error', (err) => {
        console.log(err);
    });

}