import { use, useState } from 'react'

const StatisticLine = (props) =>  {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}{props.unit}</td>
    </tr>
  );
}

const Statistics = (props) => {
  if (!props.number) 
    return (<div><p>No feedback given</p></div>);
  return (
    <div>
      <table>
        <StatisticLine text={"good"} value={props.good} unit={""}/>
        <StatisticLine text={"neutral"} value={props.neutral} unit={""}/>
        <StatisticLine text={"bad"} value={props.bad} unit={""}/>
        <StatisticLine text={"all"} value={props.number} unit={""}/>
        <StatisticLine text={"average"} value={1.0 * props.totalScore / props.number} unit=""/>
        <StatisticLine text={"positive"} value={100.0 * props.good / props.number} unit={"%"}/>
      </table>
    </div>
  );
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
    <Statistics good={good} neutral={neutral}  bad={bad} number={number} totalScore={totalScore}/>
    </>
  );
}

export default App
