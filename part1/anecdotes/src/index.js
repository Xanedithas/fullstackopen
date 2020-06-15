import React, { useState } from "react"
import ReactDOM from "react-dom"

const App = (props) => {
	const randomAnecdote = () => {
		// Sometimes returns the same number as previously generated.
		// Could make a pseudo random that returns an option from a pre generated list,
		// remove selected option, and reset when the length reaches 0
		return Math.floor(Math.random() * props.anecdotes.length)
	}

	const [selected, setSelected] = useState(randomAnecdote())
	const [votes, setVotes] = useState(Array(props.anecdotes.length).fill(0))

	const handleSelected = () => {
		setSelected(randomAnecdote())
	}

	const handleVote = () => {
		const copy = [...votes]
		copy[selected]++
		setVotes(copy)
	}

	const firstHighestValue = (arr) => {
		let index = 0
		let value = 0
		for (const a in arr) {
			if (arr[a] > value) {
				index = a
				value = arr[a]
			}
		}
		return index
	}

	const highestVotedQuote = firstHighestValue(votes)

	return (
		<div>
			<h1>Anecdote of the day</h1>
			<p>{props.anecdotes[selected]}</p>
			<p>has {votes[selected]} votes</p>
			<button onClick={handleVote}>Vote</button>&nbsp;
			<button onClick={handleSelected}>Random Anecdote</button>
			<h1>Anecdote with most votes</h1>
			<p>{props.anecdotes[highestVotedQuote]}</p>
			<p>has {votes[highestVotedQuote]} votes</p>
		</div>
	)
}

const anecdotes = [
	"If it hurts, do it more often",
	"Adding manpower to a late software project makes it later!",
	"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
	"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
	"Premature optimization is the root of all evil.",
	"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
]

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"))
