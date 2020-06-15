import React, { useState } from "react"
import ReactDOM from "react-dom"

// Unless we use a loop, I dont see the point with this refactor,
// but I should as stated in exercise: 1.10
// Instead of: <button onClick={handleGoodPlus}>good</button>,
// it now looks like: <Button handleClick={handleGoodPlus} text={"good"} />
const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
)

// Refactoring the Feedback into a seperate component is not required but I felt like doing it.
const Feedback = ({ handleGoodPlus, handleNeutralPlus, handleBadPlus }) => {
	return (
		<div>
			<h1>Feedback</h1>
			<Button handleClick={handleGoodPlus} text={"good"} />
			<Button handleClick={handleNeutralPlus} text={"neutral"} />
			<Button handleClick={handleBadPlus} text={"bad"} />
		</div>
	)
}

const Statistic = ({ name, value }) => (
	<tr>
		<td>{name}</td>
		<td>{value}</td>
	</tr>
)

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
	if (good || neutral || bad) {
		return (
			<div>
				<h1>Statistics</h1>
				<table>
					<tbody>
						<Statistic name={"good"} value={good} />
						<Statistic name={"neutral"} value={neutral} />
						<Statistic name={"bad"} value={bad} />
						<Statistic name={"all"} value={all} />
						<Statistic name={"average"} value={average} />
						<Statistic name={"positive"} value={positive} />
					</tbody>
				</table>
			</div>
		)
	} else {
		return <p>No feedback given</p>
	}
}

const App = () => {
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const handleGoodPlus = () => setGood(good + 1)
	const handleNeutralPlus = () => setNeutral(neutral + 1)
	const handleBadPlus = () => setBad(bad + 1)

	const all = good + neutral + bad
	const average = all ? (good - bad) / all : 0
	const positive = all ? `${(good / all) * 100}%` : 0

	return (
		<div>
			<Feedback
				handleGoodPlus={handleGoodPlus}
				handleNeutralPlus={handleNeutralPlus}
				handleBadPlus={handleBadPlus}
			/>
			<Statistics
				good={good}
				neutral={neutral}
				bad={bad}
				all={all}
				average={average}
				positive={positive}
			/>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById("root"))
