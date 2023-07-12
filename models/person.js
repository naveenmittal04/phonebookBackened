const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(()=>{
        console.log('Connected to MongoDB')
    })
    .catch(() => {
        console.log('Failed to Connect to DB')
    })

const personSchema = new mongoose.Schema({
    name: {
        type:String,
        minLength: 3,
        required: true
    },
    number: {
        type:String,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person