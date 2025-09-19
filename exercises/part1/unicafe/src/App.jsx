import { use, useState } from 'react'

const Average = (props) => {
  if (!props.number)
    return (<>there is no feedback yet</>);
  
  // console.log(props.number);
  return (<>average {1.0 * props.totalScore / props.number}</>);
}

const Percentage = (props) => {
  if (!props.number)
    return (<>there is no feedback yet</>);

  return (<>positive {100.0 * props.good / props.number}%</>)
}

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [number, setNumber] = useState(0);
  const [totalScore, setTotal] = useState(0);

  const updateGood = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    setNumber(number + 1);
    setTotal(updatedGood - bad);
  };

  const updateNeutral = () => {
    setNeutral(neutral + 1);
    setNumber(number + 1);
  };

  const updateBad = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    setNumber(number + 1);
    setTotal(good - updatedBad);
  };

  return (
    <>
    <h1>give feedback</h1>
    <Button onClick={updateGood} text={"good"}/>
    <Button onClick={updateNeutral} text={"neutral"}/>
    <Button onClick={updateBad} text={"bad"}/>
    <h1>statistics</h1>
    good {good}
    <br />
    neutral {neutral}
    <br />
    bad {bad}
    <br />
    all {number}
    <br />
    <Average number={number} totalScore={totalScore}/>
    <br />
    <Percentage number={number} good={good}/>
    </>
  );
}

export default App
