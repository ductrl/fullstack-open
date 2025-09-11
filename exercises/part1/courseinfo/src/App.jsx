const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  );
}

const Part = (props) => {
  return (
    <>
    <p>
      {props.partName} {props.numExercise}
    </p>
    </>
  );
}

const Content = (props) => {
  return (
    <>
    <p><Part partName={props.parts[0]} numExercise={props.exercises[0]}/></p>
    <p><Part partName={props.parts[1]} numExercise={props.exercises[1]}/></p>
    <p><Part partName={props.parts[2]} numExercise={props.exercises[2]}/></p>
    </>
  );
}

const Total = (props) => {
  return (
    <p>Number of exercises: {props.total}</p>
  );
}

const App = () => {
  const course = "Half Stack application development";
  const parts = ["Fundamentals of React", "Using props to pass data", "State of a component"];
  const exercises = [10, 7, 14];

  return (
    <>
      <Header course={course}></Header>
      <Content parts={parts} exercises={exercises}/>
      <Total total={exercises[0] + exercises[1] + exercises[2]}/>
    </>
  );
}

export default App;