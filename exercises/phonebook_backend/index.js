require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require('./models/person.js');

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
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person);
  });
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
})

const checkNameExist = (name) => persons.some(p => p.name === name);

app.post('/api/persons/', (request, response) => {
    const id = Math.floor(Math.random() * 1000 + 1);
    const body = request.body;

    if (!body.name) 
      return response.status(400).json({ error: 'name is missing' });
    if (!body.number) 
      return response.status(400).json({ error: 'number is missing' });
    if (checkNameExist(body.name))
      return response.status(400).json({ error: 'name must be unique' });

    const newPerson = {
      id: String(id),
      ...body,
    };    
    
    persons = persons.concat(newPerson);

    response.json(newPerson);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log('Phonebook is displayed in http://localhost:3001/api/persons');
console.log('Info requests can be made at http://localhost:3001/info');
// app.use(morgan('combined', ':method :url :status :response-time ms :res'));

