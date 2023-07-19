require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')



app.use(express.json())
app.use(express.static('build'))
app.use(cors())


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
      response.json(person)
    })
})

app.get('/info',(request,response) => {
    response.send(`<div><h1>info</h1><p>Phonebook has info for ${count} people</p><p>${date}</p></div>`)
})

app.get('/api/persons/:id',(request,response) => {
    Person.findById(request.params.id).then(person =>{
      response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(person =>{
      response.status(204).send("Delete Successful")
    }).catch(error => next(error))
  })


  app.post('/api/persons', (request, response,next) => {
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


    const person = new Person({
        name : body.name,
        number : body.number,
    })
    person.save().then(person => {
      response.json(person)
    }).catch(error => next(error))
  })


  app.post('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query'})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)
 

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  // handler of requests with result to errors
  app.use(errorHandler)


  const PORT = process.env.PORT || 3001
  app.listen(PORT)
    console.log(`Server running on port ${PORT}`)
