import React from "react"
//import ReactDOM from "react-dom"

const Header = ({ course }) => {
	return <h1>{course.name}</h1>
}

const reducer = (acc, cur) => acc + cur

const Total = ({ course }) => {
	const sum = course.parts.map((p) => p.exercises).reduce(reducer)
	return (
		<p>
			<b>Total of {sum} exercises</b>
		</p>
	)
}

const Part = ({ part }) => {
	const { name, exercises } = part
	return (
		<p>
			{name} {exercises}
		</p>
	)
}

const Content = ({ course }) => {
	return course.parts.map((p) => <Part key={p.id} part={p} />)
}

const Course = ({ course }) => {
	return (
		<div>
			<Header course={course} />
			<Content course={course} />
			<Total course={course} />
		</div>
	)
}

export default Course