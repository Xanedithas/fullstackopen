const mongoose = require("mongoose")

if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	)
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook-backend:${password}@phonebookcluster.xxsjw.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Contact = mongoose.model("Contact", contactSchema)

if (process.argv.length < 5) {
	const filter = {}

	Contact.find(filter).then((result) => {
		console.log("Phonebook:")
		result.forEach((contact) => {
			console.log(`${contact.name} ${contact.number}`)
		})
		mongoose.connection.close()
	})
} else {
	const contact = new Contact({
		name: process.argv[3],
		number: process.argv[4],
	})

	contact.save().then((result) => {
		console.log(`Added ${contact.name} ${contact.number} to phonebook`)
		mongoose.connection.close()
	})
}
