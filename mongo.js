const mongoose = require('mongoose')

const inputs = process.argv
console.log(inputs)

if(inputs.length < 3){
    return
}

const password = inputs[2]

const url = `mongodb+srv://naveenmittal04:${password}@cluster0.iurwwfg.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

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
