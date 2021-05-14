const mongoose = require('mongoose');


let isConnected;

mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
    console.log('Connection Established');
});

mongoose.connection.on('reconnected', () => {
    console.log('Connection Reestablished');
});

mongoose.connection.on('disconnected', () => {
    console.log('Connection Disconnected');
});

mongoose.connection.on('close', () => {
    console.log('Connection Closed');
});

mongoose.connection.on('error', (error) => {
    console.log('ERROR: ' + error);
});


const connectDatabase = function(){
    return new Promise((resolve,reject)=>{
        mongoose.connect(`${process.env.DB_PREFIX}${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true}).then(conn=>{
            resolve(conn)
        })
    })
}

const closeDatabase = function(){
    return new Promise((resolve,reject)=>{
        resolve(true)
    })
}


module.exports = {
    connectDatabase
}