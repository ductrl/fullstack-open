import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('John Doe');
  const [newNumber, setNewNumber] = useState('123-456-7890');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data)
      });
  }, []);

  const peopleDisplayed = nameFilter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()));

  const addPerson = (event) => {
    event.preventDefault();
    console.log(event.target);
    if (persons.find(person => person.name == newName) !== undefined) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    setPersons(persons.concat({ 
      name: newName,
      number: newNumber
     }));
    setNewName('');
    setNewNumber('');
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

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} handleFilterChange={handleFilterChange}></Filter>

      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}></PersonForm>

      <h2>Numbers</h2>
      <Persons peopleDisplayed={peopleDisplayed}></Persons>
    </div>
  );
}

export default App;