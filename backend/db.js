const mongoose = require('mongoose');

const connectionLink = process.env.DB_CONNECTION_STRING;

const connction = () => {
    mongoose.connect(connectionLink).then(
        () => console.log('connected to database'), (err) => console.error(err)
    );
};

module.exports = connction;