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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error=>{
            console.log('Failed to get persons from DB')
            next(error)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch((error)=>{
            next(error)
        })
})

app.get('/info', (request, response, next) => {
    Person.count({})
        .then(count => {
            response.end(`<p>Phonebook has info for ${count} people</p>`
                +`<p> ${new Date()}</p>`)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.deleteOne({_id:request.params.id})
        .then(()=>{
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
        .catch(error=>{
            console.log('Failed to save to DB')
            next(error)
        })
})

const unknowEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknowEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if(error.name === 'CastError'){
        return response.status(400).end({
            error: 'malformed request'
        })
    } else if(error.name === 'BSONError') {
        return response.status(400).end({
            error: 'malformed request'
        })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log("server started")
})
