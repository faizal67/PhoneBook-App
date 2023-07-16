const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))

app.use(cors())

app.use(express.json())
app.use(morgan('combined'))
morgan.token('type', function (req, res) { return req.headers['content-type'] })
let persons = 
    [
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
          "name": "faizal Poppendieck", 
          "number": "39-23-6423122"
        }
    ]

const count = Math.max(...persons.map(n=>n.id))
const date = new Date()

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info',(request,response) => {
    response.send(`<div><h1>info</h1><p>Phonebook has info for ${count} people</p><p>${date}</p></div>`)
})

app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(n=>n.id == id)
    if(person)
    response.json(person)
    else
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const generateId = ()=>{
    const maxId = persons.length > 0? Math.max(...persons.map(n => n.id)) : 0
    return maxId+1
  }

  const ispresent = (name) =>{
    const person = persons.find((person => person.name === name))
    if(person)
    return true
    else
    return false
  }


  app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
      
    if(ispresent(body.name)){
        console.log("already Exist ")
        return response.status(400).json({
            error: 'Name must be unique'
    })}

    const person = {
        id : generateId(),
        name : body.name,
        number : body.number,
    }
    persons = persons.concat(person)
    response.json(person)
  })


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })