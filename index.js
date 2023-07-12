require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('type', function (req) { return JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :type\n'))

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(()=>{
            console.log('Failed to get persons from DB')
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(()=>{
            response.status(404).end()
        })
})

app.get('/info', (request, response) => {
    Person.count({})
        .then(count => {
            response.end(`<p>Phonebook has info for ${count} people</p>`
                +`<p> ${new Date()}</p>`)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.deleteOne({_id:request.params.id})
        .then(()=>{
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    console.log(`add /persons/ ${person} request received`)
    if(!person.hasOwnProperty('name')){
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(!person.hasOwnProperty('number')){
        return response.status(400).json({
            error: 'number missing'
        })
    }

    // Person.find({name: person.name})
    //     .then(result => {
    //         if(result === []) {
    //             return response.status(400).json({
    //                 error: `name must be unique`
    //             })
    //         }
    //
    //     })

    const newPerson = new Person({
        name: person.name,
        number: person.number
    })

    newPerson.save()
        .then(result => {
            response.json(result)
        })
        .catch(()=>{
            console.log('Failed to save to DB')
        })
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log("server started")
})
