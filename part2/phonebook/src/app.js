import React, { useState } from "react"

const Contact = ({ person }) => (
	<div>
		{person.name} {person.number}
	</div>
)

const Add = ({ addHandler }) => {
	const [name, setName] = useState("")
	const [number, setNumber] = useState("")

	const onSubmit = (e) => {
		e.preventDefault()
		addHandler({ name: name.trim(), number: number.trim() })
		setName("")
	}

	return (
		<form onSubmit={onSubmit}>
			<div>
				<label name="name">Name:</label>
				<input
					name="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div>
				<label name="number">Number:</label>
				<input
					name="number"
					value={number}
					onChange={(e) => setNumber(e.target.value)}
				/>
			</div>
			<button type="submit">add</button>
		</form>
	)
}

const Search = ({ searchHandler }) => {
	const [search, setSearch] = useState("")

	const onSearch = (e) => {
		setSearch(e.target.value)
		searchHandler(e.target.value)
	}

	return (
		<div>
			<label name="search">Search:</label>
			<input name="search" value={search} onChange={(e) => onSearch(e)} />
		</div>
	)
}

const App = () => {
	const [contactSearch, setContactSearch] = useState("")

	const [persons, setPersons] = useState([
		{ name: "Arto Hellas", number: "040-123456" },
		{ name: "Ada Lovelace", number: "39-44-5323523" },
		{ name: "Dan Abramov", number: "12-43-234345" },
		{ name: "Mary Poppendieck", number: "39-23-6423122" },
	])

	const addPerson = (person) => {
		const equals = (p) => p.name === person.name
		const exists = persons.filter(equals).length
		if (exists) {
			alert(`${person.name} already exists in the phonebook`)
			return
		}
		setPersons(persons.concat(person))
	}

	const searchPerson = (search) => {
		setContactSearch(search)
	}

	const contacts = persons
		.filter((p) => p.name.toLowerCase().includes(contactSearch.toLowerCase()))
		.map((p) => <Contact key={p.name} person={p} />)

	return (
		<div>
			<h2>Phonebook</h2>
			<h2>Add a new contact</h2>
			<Add addHandler={addPerson} />
			<h2>Search for a contact</h2>
			<Search searchHandler={searchPerson} />
			<h2>Contacts</h2>
			{contacts.length ? contacts : "No contacts found"}
		</div>
	)
}

export default App
