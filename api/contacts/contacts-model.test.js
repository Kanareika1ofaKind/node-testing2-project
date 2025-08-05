const db = require('../../data/dbConfig.js');
const Contacts = require('./contacts-model.js');



const contact1 = { firstname: 'John', lastname: 'Doe', contactNo: '+5565' };
const contact2 = { firstname: 'Jane', lastname: 'Smith', contactNo: '+5566' };

test('Database connection is established', () => {
    expect(db).toBeDefined();
});

test('Database is using the correct environment', () => {
    expect(process.env.DB_ENV).toBe('testing'); // Ensure this matches your test environment
});

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

afterAll(async () => {
    await db.destroy();
});

beforeEach(async () => {
 await db('contacts').truncate(); // Clear contacts table before each test
});

describe('Contacts Model', () => {

    describe('getContacts', () => {
        it('should return an empty array when no contacts exist', async () => {
            const contacts = await Contacts.getContacts();
            expect(contacts).toEqual([]);
        });

        it('should return all contacts', async () => {
            await db('contacts').insert([contact1, contact2]);
            const contacts = await Contacts.getContacts();
            expect(contacts).toHaveLength(2);
            expect(contacts[0].firstname).toBe('John');
            expect(contacts[1].lastname).toBe('Smith');
            expect(contacts[0].contactNo).toBe('+5565');
        });
    });


    describe('getContactById', () => {
        it('should return a contact by ID', async () => {
            await db('contacts').insert(contact1);
            const contact = await Contacts.getContactById(1);
            expect(contact).toBeDefined();
            expect(contact.firstname).toBe('John');
            expect(contact.lastname).toBe('Doe');
            expect(contact.contactNo).toBe('+5565');
        });
        it('should return null for non-existent contact', async () => {
            const contact = await Contacts.getContactById(999);
            expect(contact).toBeFalsy(); // Expect null for non-existent contact
        });
    });

    describe('createContact', () => {
        it('should add a new contact', async () => {
            const newContact = { firstname: 'new', lastname: 'contact', contactNo: '+889899' };
            const createdContact = await Contacts.createContact(newContact);
            expect(createdContact).toBeDefined();
            expect(createdContact.firstname).toBe('new');
            expect(createdContact.lastname).toBe('contact');
            expect(createdContact.contactNo).toBe('+889899');
            const contacts = await db('contacts');
            expect(contacts).toHaveLength(1); // 1 new contact
        });
    });

    describe('updateContact', () => {
        it('should modify an existing contact', async () => {
            await db('contacts').insert(contact1);
            const updatedContact = { firstname: 'updated', lastname: 'contact', contactNo: '+4566558' };
            const contact = await Contacts.updateContact(1, updatedContact);
            expect(contact).toBeDefined();
            expect(contact.firstname).toBe('updated');
            expect(contact.lastname).toBe('contact');
            expect(contact.contactNo).toBe('+4566558');
        });
        it('should return null for non-existent contact', async () => {
            const contact = await Contacts.updateContact(999, contact1);
            expect(contact).toBeFalsy(); // Expect null for non-existent contact
        });
    });

    describe('deleteContact', () => {
        it('should remove a contact', async () => {
            await db('contacts').insert(contact1);
            const deletedContact = await Contacts.deleteContact(1);
            expect(deletedContact).toBeDefined();
            const contact = await db('contacts').where({ contact_id: 1 }).first();
            expect(contact).toBeFalsy(); // Contact should be deleted
            const contacts = await db('contacts');
            expect(contacts).toHaveLength(0); // Contact should be deleted
        });

        it('should return null for non-existent contact', async () => {
            const deletedContact = await Contacts.deleteContact(999);
            expect(deletedContact).toBeFalsy(); // Expect null for non-existent contact
        });
    });


});
