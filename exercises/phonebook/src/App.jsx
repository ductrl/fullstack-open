import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import notesService from './services/notes';
import notes from './services/notes';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('John Doe');
  const [newNumber, setNewNumber] = useState('123-456-7890');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    notesService
      .getAll()
      .then(initialPersons => setPersons(initialPersons));
  }, []);

  const peopleDisplayed = nameFilter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()));

  const updateNumber = (newPerson) => {
    const person = persons.find(p => p.name === newPerson.name);
    const updatedPerson = {...person, number: newPerson.number};

    notesService
      .update(person.id, updatedPerson)
      .then(returnedPerson => { setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson)) });
  }

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { 
      name: newName,
      number: newNumber,
      id: `${persons.length + 1}`
     };

    if (persons.find(person => person.name == newName) !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) 
        updateNumber(newPerson);
      return;
    }

    notesService
      .create(newPerson)
      .then(returnedPersons => {
        console.log(returnedPersons);
        setPersons(persons.concat(returnedPersons));
        setNewName('');
        setNewNumber('');
      });
  }

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value);
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      notesService
        .deleteId(id)
        .then(() => {
          const updatedPersons = persons.filter(p => p.id !== id);
          setPersons(updatedPersons);
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} handleFilterChange={handleFilterChange}></Filter>

      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}></PersonForm>

      <h2>Numbers</h2>
      <Persons peopleDisplayed={peopleDisplayed} handleDelete={handleDelete}></Persons>
    </div>
  );
}

export default App;