import Person from './Person';

const Persons = ({ peopleDisplayed, handleDelete }) => {
    return (
        <ul>
            {peopleDisplayed.map(person => <Person key={person.name} name={person.name} number={person.number} id={person.id} handleDelete={handleDelete}/>)}
        </ul>
    );
}

export default Persons;