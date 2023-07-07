const express = require('express')

const app = express()

const persons = [
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

const PORT = 3003
app.listen(PORT, ()=>{
    console.log("server started")
})