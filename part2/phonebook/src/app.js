import React, { useState, useEffect } from "react"
import Services from "./services"

const Notification = ({ notification }) => {
	if (notification === null || notification === undefined) return null

	const color = { color: (notification.error ? "red" : notification.success ? "green" : "gray") }

	return (
		<div style={color} className="message">
			{notification.message}
		</div>
	)
}

const Contact = ({ contact, deleteHandler }) => (
	<div>
		{contact.name} {contact.number}{" "}
		<button onClick={deleteHandler}>delete</button>
	</div>
)

const Add = ({ addHandler }) => {
	const [name, setName] = useState("")
	const [number, setNumber] = useState("")

	const onSubmit = (e) => {
		e.preventDefault()
		addHandler({ name: name.trim(), number: number.trim() })
		setName("")
		setNumber("")
	}

	return (
		<form onSubmit={onSubmit}>
			<div>
				<label name="name">Name:</label>
				<input
					name="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					autoComplete="off"
				/>
			</div>
			<div>
				<label name="number">Number:</label>
				<input
					name="number"
					value={number}
					onChange={(e) => setNumber(e.target.value)}
					autoComplete="off"
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
			<input
				name="search"
				value={search}
				onChange={(e) => onSearch(e)}
				autoComplete="off"
			/>
		</div>
	)
}

const App = () => {
	const [contactSearch, setContactSearch] = useState("")
	const [contacts, setContacts] = useState([])
	const [notification, setNotification] = useState()

	const setNotificationTimeout = (notification) => {
		setNotification(notification)
		setTimeout(() => {
			setNotification(null)
		}, 5000)
	}

	const readPhonebook = () => {
		Services.read()
			.then((obj) => {
				setContacts(obj)
			})
			.catch((err) => {
				console.log(err)
				console.log(err.response)
				setNotificationTimeout({
					error: true,
					message: err.response.data.message || `Could not read the phonebook. Please try again later.`,
				})
			})
	}
	useEffect(readPhonebook, [])

	const addContact = (contact) => {
		const equals = (c) => c.name === contact.name
		const match = contacts.filter(equals)
		if (match.length) {
			return updateContact(match[0], contact.number)
		}
		Services.create(contact)
			.then((c) => {
				setContacts(contacts.concat(c))
				setNotificationTimeout({
					success: true,
					message: `${contact.name} is added to the phonebook.`,
				})
			})
			.catch((err) => {
				console.log(err)
				console.log(err.response)
				setNotificationTimeout({
					error: true,
					message: err.response.data.message || `${contact.name} could not be added to the phonebook. Please try again later.`,
				})
			})
	}

	const updateContact = (contact, newNumber) => {
		if (
			window.confirm(
				`${contact.name} is already added to the phonebook, would you like to replace the old number (${contact.number}) with the new number (${newNumber}) ?`
			)
		) {
			Services.update(contact.id, { ...contact, number: newNumber })
				.then((updatedContact) => {
					setContacts(
						contacts.map((c) => (c.id !== contact.id ? c : updatedContact))
					)
					setNotificationTimeout({
						success: true,
						message: `${contact.name}'s information is updated.`,
					})
				})
				.catch((err) => {
					console.log(err)
					console.log(err.response)
					setNotificationTimeout({
						error: true,
						message: err.response.data.message || `Could not update ${contact.name} in the phonebook. Please try again later.`,
					})
				})
		}
	}

	const searchContact = (search) => {
		setContactSearch(search)
	}

	const deleteContact = (contact) => {
		if (window.confirm(`Delete ${contact.name} ?`)) {
			Services.destroy(contact.id)
				.then(() => {
					setContacts(contacts.filter((c) => c.id !== contact.id))
					setNotificationTimeout({
						success: true,
						message: `${contact.name} is removed from the phonebook.`,
					})
				})
				.catch((err) => {
					console.log(err)
					console.log(err.response)
					setNotificationTimeout({
						error: true,
						message: err.response.data.message || `Could not find ${contact.name} in the phonebook, perhaps it was already removed?`,
					})
				})
		}
	}

	const contactMap = contacts
		.filter((c) => c.name.toLowerCase().includes(contactSearch.toLowerCase()))
		.map((c) => (
			<Contact
				key={c.name}
				contact={c}
				deleteHandler={() => deleteContact(c)}
			/>
		))

	return (
		<div>
			<h1>Phonebook</h1>
			<Notification notification={notification} />
			<h2>Add a new contact</h2>
			<Add addHandler={addContact} />
			<h2>Search for a contact</h2>
			<Search searchHandler={searchContact} />
			<h2>Contacts</h2>
			{contactMap.length ? contactMap : "No contacts found"}
		</div>
	)
}

export default App
