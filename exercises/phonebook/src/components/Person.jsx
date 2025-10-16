const Person = ({ name, number, id, handleDelete }) => {
    return (
        <>
            <li >
                {name} {number}
                <button onClick={() => {handleDelete(id, name)}}>delete</button>
            </li>
        </>
    )
}

export default Person;