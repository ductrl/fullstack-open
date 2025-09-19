import { use, useState } from 'react'

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
    <h1>give feedback</h1>
    <Button onClick={() => {setGood(good + 1)}} text={"good"}/>
    <Button onClick={() => {setNeutral(neutral + 1)}} text={"neutral"}/>
    <Button onClick={() => {setBad(bad + 1)}} text={"bad"}/>
    <h1>statistics</h1>
    good {good}
    <br />
    neutral {neutral}
    <br />
    bad {bad}
    </>
  );
}

export default App
