require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require('./models/person.js');

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError')
    return response.status(400).json({ error: 'malformatted id' });
  if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message });
  
  next(error);
};

app.use(express.json());
app.use(express.static('dist'));

morgan.token('person', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :person'));

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/info', (request, response) => {
    const now = new Date();
    Person.find({}).then(persons => {
      response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>
        `);
    });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person);
  });
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      if (!person)
        response.status(404).end();
      else
        response.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then(person => {
      if (!person)
        return response.status(404).end();

      person.name = name;
      person.number = number;

      return person.save().then(updatedPerson => {
        response.json(updatedPerson);
      });
    })
    .catch(error => next(error));
}); 

const checkNameExist = (name) => persons.some(p => p.name === name);

app.post('/api/persons/', (request, response, next) => {
    const body = request.body;

    if (!body.name) 
      return response.status(400).json({ error: 'name is missing' });
    if (!body.number) 
      return response.status(400).json({ error: 'number is missing' });
    // if (checkNameExist(body.name))
    //   return response.status(400).json({ error: 'name must be unique' });

    const newPerson = {
      name: body.name,
      number: body.number
    };

    const person = new Person(newPerson);

    person.save()
      .then(result => {
        console.log(`Added ${newPerson.name} number ${newPerson.number} to the phonebook!`);
      })
      .catch(error => next(error) );
})

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log('Phonebook is displayed in http://localhost:3001/api/persons');
console.log('Info requests can be made at http://localhost:3001/info');
// app.use(morgan('combined', ':method :url :status :response-time ms :res'));

