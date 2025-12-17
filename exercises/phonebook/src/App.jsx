import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';
import persons from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('John Doe');
  const [newNumber, setNewNumber] = useState('123-456-7890');
  const [nameFilter, setNameFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons));
  }, []);

  const peopleDisplayed = nameFilter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()));

  const updateNumber = (newPerson) => {
    const person = persons.find(p => p.name === newPerson.name);
    const updatedPerson = {...person, number: newPerson.number};

    personService
      .update(person.id, updatedPerson)
      .then(returnedPerson => { 
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson));
        setSuccessMessage(`Changed ${person.name}'s number`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
       })
      .catch(error => {
        setErrorMessage(`Information of ${person.name} has already been removed from the server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
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

    personService
      .create(newPerson)
      .then(returnedPersons => {
        console.log(returnedPersons);
        setPersons(persons.concat(returnedPersons));
        setNewName('');
        setNewNumber('');
        setSuccessMessage(`Added ${newPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch(error => {
        console.log(error.response.data.error);
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
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
      personService
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
      <Notification message={successMessage} type={"success"}></Notification>
      <Notification message={errorMessage} type={"error"}></Notification>
      <Filter nameFilter={nameFilter} handleFilterChange={handleFilterChange}></Filter>

      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}></PersonForm>

      <h2>Numbers</h2>
      <Persons peopleDisplayed={peopleDisplayed} handleDelete={handleDelete}></Persons>
    </div>
  );
}

export default App;