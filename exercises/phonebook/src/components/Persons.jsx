const Persons = ({ peopleDisplayed }) => {
    return (
        <ul>
            {peopleDisplayed.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
        </ul>
    );
}

export default Persons;