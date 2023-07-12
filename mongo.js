const mongoose = require('mongoose')

const inputs = process.argv
console.log(inputs)

if(inputs.length < 3){
    return
}

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(()=>{
        console.log('Connected to MongoDB')
    })
    .catch(() => {
        console.log('Failed to Connect to DB')
    })

const phonebookSchema = mongoose.Schema({
    name: String,
    number: String
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if(inputs.length > 3) {
    const input_name = inputs[3]
    const input_number = inputs[4]

    const newEntry = new Phonebook({
        name: input_name,
        number: input_number
    })

    newEntry.save().then(result => {
        console.log(result)
        mongoose.connection.close()
    })

} else {
    Phonebook.find({}).then(result => {
        result.forEach(entry => {
            console.log(entry)
        })
        mongoose.connection.close()
    })
}
