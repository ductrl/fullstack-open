const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const friends = ['Mike', 'Peter'];

  return (
    <>
    <p>{friends}</p>
    </>
  );
}

export default App;