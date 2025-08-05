const express = require("express");

const contactsRouter = require("./contacts/contacts-router.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({ api: "up" });
});

// Mount the contacts router on the /api/contacts endpoint
server.use("/api/contacts", contactsRouter);

// Error handling middleware
server.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

module.exports = server;