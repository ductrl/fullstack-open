const Filter = ({ nameFilter, handleFilterChange }) => {
    return (
        <>filter shown with <input value={nameFilter} onChange={handleFilterChange}/></>
    )
}

export default Filter;