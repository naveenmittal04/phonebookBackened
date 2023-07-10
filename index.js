const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('type', function (req) { return JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :type\n'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.get('/api/persons', (request, response) => {
    console.log("get /persons/ request received")
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(`get /persons/${id} request received`)
    const person = persons.find(p => p.id === id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.end(`<p>Phonebook has info for ${persons.length} people</p>`
    +`<p> ${new Date()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(`delete /persons/${id} request received`)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

let maxId = 4


const getId = () => {
    maxId += 1
    return maxId
}

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

    if(persons.find(p => p.name === person.name)){
        return response.status(400).json({
            error: `name must be unique`
        })
    }

    const newPerson = {
        name: person.name,
        number: person.number,
        id: getId()
    }

    persons.push(newPerson)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3003
app.listen(PORT, ()=>{
    console.log("server started")
})