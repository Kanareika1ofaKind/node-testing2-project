const db = require('../../data/dbConfig');

async function getContacts() {
    const contacts = await db('contacts');
    return contacts;
}

async function getContactById(id) {
    const contact = await db('contacts').where({ contact_id: id }).first();
    return contact;
}

async function createContact(contactData) {
    const [newContactId] = await db('contacts').insert(contactData);
    return getContactById(newContactId);
}

async function updateContact(id, contactData) {
    await db('contacts').where({ contact_id: id }).update(contactData);
    return getContactById(id);
}

async function deleteContact(id) {
    const contact = await getContactById(id);
    await db('contacts').where({ contact_id: id }).del();
    return contact; // Return the deleted contact
}

module.exports = {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
