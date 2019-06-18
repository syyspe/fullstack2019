const mongoose = require('mongoose')

// Set useCreateIndex to get rid of deprecation warning:
// (https://mongoosejs.com/docs/deprecations.html)
mongoose.set('useCreateIndex', true)

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 1
    },
    born: {
        type: Number
    },
    bookCount: {
        type: Number
    }
})

module.exports = mongoose.model('Author', schema)