const supertest = require('supertest');
const db = require('../data/dbConfig');
const Contacts = require('./contacts/contacts-model');
const app = require('./server'); // Adjust the path to your server file

const request = supertest(app);

const contact1 = { firstname: 'John', lastname: 'Doe', contactNo: '+31655' };
const contact2 = { firstname: 'Jane', lastname: 'Smith', contactNo: '+31656' };


beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

afterAll(async () => {
    await db.destroy();
});

beforeEach(async () => {
    await db('contacts').truncate(); // Clear contacts table before each test
    // Seed the database with initial contacts
});

describe('Contacts API', () => {

    describe('GET /api/contacts', () => {
        it('GET /api/contacts returns all contacts', async () => {
            await db('contacts').insert([contact1, contact2]);
            const response = await request.get('/api/contacts');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2); // Adjust based on your seed data
            expect(response.body[0].firstname).toBe('John');
            expect(response.body[1].firstname).toBe('Jane');
        });
        it('GET /api/contacts returns an empty array when no contacts exist', async () => {
            const response = await request.get('/api/contacts');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

    });

    describe('GET /api/contacts/:id', () => {
        it('GET /api/contacts/:id returns a contact by ID', async () => {
            await db('contacts').insert(contact1);
            const response = await request.get('/api/contacts/1');
            expect(response.status).toBe(200);
            expect(response.body.firstname).toBe('John');
            expect(response.body.lastname).toBe('Doe');
        });
        it('GET /api/contacts/:id returns 404 for non-existent contact', async () => {
            const response = await request.get('/api/contacts/999');
            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/contacts', () => {
        it('POST /api/contacts creates a new contact', async () => {
            const response = await request.post('/api/contacts').send(contact1);
            expect(response.status).toBe(201);
            expect(response.body.firstname).toBe('John');
            expect(response.body.lastname).toBe('Doe');
            expect(response.body.contactNo).toBe('+31655');
            const contacts = await db('contacts');
            expect(contacts).toHaveLength(1); // 1 new contact
        });
        it('POST /api/contacts returns 400 for invalid data', async () => {
            const response = await request.post('/api/contacts').send({ firstname: 'Invalid' });
            expect(response.status).toBe(400);
        });
        it('POST /api/contacts returns 400 for missing required fields', async () => {
            const response = await request.post('/api/contacts').send({ lastname: 'Doe' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Firstname, lastname, and contact number are required');
        });
    });

    describe('PUT /api/contacts/:id', () => {
        it('PUT /api/contacts/:id updates an existing contact', async () => {
            await db('contacts').insert(contact1);
            const updatedContact = { firstname: 'John', lastname: 'Updated', contactNo: '+556898' };
            const response = await request.put('/api/contacts/1').send(updatedContact);
            expect(response.status).toBe(200);
            expect(response.body.firstname).toBe('John');
            expect(response.body.lastname).toBe('Updated');
            expect(response.body.contactNo).toBe('+556898');
        });
        it('PUT /api/contacts/:id returns 404 for non-existent contact', async () => {
            const response = await request.put('/api/contacts/999').send(contact1);
            expect(response.status).toBe(404);
        });

        it('PUT /api/contacts/:id returns 400 for invalid data', async () => {
            await db('contacts').insert(contact1);
            const response = await request.put('/api/contacts/1').send({ firstname: 'Invalid' });
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/contacts/:id', () => {
        it('DELETE /api/contacts/:id deletes a contact', async () => {
            await db('contacts').insert(contact1);
            const response = await request.delete('/api/contacts/1');
            expect(response.status).toBe(200);
            const contacts = await db('contacts');
            expect(contacts).toHaveLength(0); // Contact should be deleted
        });
        it('DELETE /api/contacts/:id returns 404 for non-existent contact', async () => {
            const response = await request.delete('/api/contacts/999');
            expect(response.status).toBe(404);
        });
        it('DELETE /api/contacts/:id returns the deleted contact', async () => {
            await db('contacts').insert(contact1);
            const response = await request.delete('/api/contacts/1');
            expect(response.status).toBe(200);
            expect(response.body.firstname).toBe('John');
            expect(response.body.lastname).toBe('Doe');
            expect(response.body.contactNo).toBe('+31655');
        });
    });

});