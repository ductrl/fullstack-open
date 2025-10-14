import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const defaultPhonebook = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ];

  const [persons, setPersons] = useState(defaultPhonebook);
  const [newName, setNewName] = useState('John Doe');
  const [newNumber, setNewNumber] = useState('123-456-7890');
  const [nameFilter, setNameFilter] = useState('');

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