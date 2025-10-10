import Part from './Part';

const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
  );
}

const Content = ({ courseId, parts }) => {
  return (
    <>
    {parts.map(part => <Part key={`${courseId}-${part.id}`} partName={part.name} numExercise={part.exercises}/>)}
    </>
  );
}

const Total = ({ parts }) => {
  return (
    <strong>Number of exercises: {parts.reduce((accumulator, currentValue) => (accumulator + currentValue.exercises), 0)}</strong>
  );
}

const Course = ({ course }) => {
    return (
        <>
            <Header course={course}></Header>
            <Content courseId={course.id} parts={course.parts}/>
            <Total parts={course.parts}/>
        </>
    );
}

export default Course;