const Router = require('express').Router();
const { getContacts, getContactById, createContact, updateContact, deleteContact } = require('./contacts-model');

// Get all contacts
Router.get('/', async (req, res, next) => {
	try {
		const contacts = await getContacts();
		res.status(200).json(contacts);
	} catch (err) {
		next(err);
	}
});

// Get a contact by ID
Router.get('/:id', async (req, res, next) => {
	try {
		const contact = await getContactById(req.params.id);
		if (!contact) {
			return res.status(404).json({ message: 'Contact not found' });
		}
		res.status(200).json(contact);
	} catch (err) {
		next(err);
	}
});

// Create a new contact
Router.post('/', async (req, res, next) => {

	if (!req.body.firstname || !req.body.lastname || !req.body.contactNo) {
		return res.status(400).json({ message: 'Firstname, lastname, and contact number are required' });
	}

	try {
		const newContact = await createContact(req.body);
		res.status(201).json(newContact);
	} catch (err) {
		next(err);
	}
});

// Update a contact
Router.put('/:id', async (req, res, next) => {

    const [id] = req.params.id;

	if (!req.body.firstname || !req.body.lastname || !req.body.contactNo) {
		return res.status(400).json({ message: 'Firstname, lastname, and contact number are required' });
	}

	const contact = await getContactById(id);

	if (!contact) {
		return res.status(404).json({ message: 'Contact not found' });
	}

	try {
		const updatedContact = await updateContact(req.params.id, req.body);
		if (!updatedContact) {
			return res.status(404).json({ message: 'Contact not found' });
		}
		res.status(200).json(updatedContact);
	} catch (err) {
		next(err);
	}
});

// Delete a contact
Router.delete('/:id', async (req, res, next) => {

	try {
		const deletedContact = await deleteContact(req.params.id);
		if (!deletedContact) {
			return res.status(404).json({ message: 'Contact not found' });
		}
        res.status(200).json(deletedContact);
	} catch (err) {
		next(err);
	}
});






module.exports = Router;

