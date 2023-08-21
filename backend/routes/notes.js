const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');

// 1 get all the notes of a user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    }
    catch (err) {
        res.status(500).send("Internal error occurred")
    }
})

// 2 add notes

router.post('/addnote', fetchuser, [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;

    try {
        const notes = await Notes.create({
            title: title,
            description: description,
            tag: tag,
            user: req.user.id
        })
        res.json(notes)
    }
    catch (err) {
        res.status(500).send("Internal error occurred")
    }
})

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access denied");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    }
    catch (err) {
        res.status(500).send("Internal error occurred")
    }
})

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access denied");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success" : "Deleted successfully !!"})
    }
    catch (err) {
        res.status(500).send("Internal error occurred")
    }
})

module.exports = router;