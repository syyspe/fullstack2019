require('dotenv').config()
const mongoose = require('mongoose')

const connect = () => {
    mongoose
        .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
        .then(
            (value) => {
                console.log('connected to database', value.connections[0].name)
            },
            (err) => {
                console.log('mongoose failed: ', err)
            })
}

module.exports = connect