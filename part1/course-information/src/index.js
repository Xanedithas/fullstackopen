import React from "react"
import ReactDOM from "react-dom"

const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
	<p>
		{props.part} {props.exercises}
	</p>
)

const Content = (props) => {
	// props.parts.map() "at this point you can assume that there are always three items, so there is no need to go through the arrays using loops."
	return (
		<div>
			<Part part={props.parts[0].name} exercises={props.parts[0].exercises} />
			<Part part={props.parts[1].name} exercises={props.parts[1].exercises} />
			<Part part={props.parts[2].name} exercises={props.parts[2].exercises} />
		</div>
	)
}

const Total = (props) => {
	// props.parts.reduce() "at this point you can assume that there are always three items, so there is no need to go through the arrays using loops."
	return (
		<p>
			Number of exercises {
				props.parts[0].exercises + 
				props.parts[1].exercises + 
				props.parts[2].exercises
			}
		</p>
	)
}

const App = () => {
	const course = {
		name: "Half Stack application development",
		parts: [
			{
				name: "Fundamentals of React",
				exercises: 10,
			},
			{
				name: "Using props to pass data",
				exercises: 7,
			},
			{
				name: "State of a component",
				exercises: 14,
			},
		],
	}

	return (
		<div>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById("root"))
