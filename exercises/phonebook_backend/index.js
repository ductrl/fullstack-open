const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

morgan.token('person', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :person'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const now = new Date();
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>
        `);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(p => p.id === id);
    console.log(person);
    
    if (!person)
        return response.status(404).end();

    response.json(person);
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

const PORT = 3001;
app.listen(PORT);
console.log('Phonebook is displayed in http://localhost:3001/api/persons');
console.log('Info requests can be made at http://localhost:3001/info');
// app.use(morgan('combined', ':method :url :status :response-time ms :res'));

