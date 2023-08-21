import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {

    const host = 'http://localhost:5000';

    const notesInit = []

    const [notes, setNotes] = useState(notesInit);

    // get all notes

    const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
        const json = await response.json()
        setNotes(json)
    }

    // add a note

    const addNote = async (title, description, tag) => {

        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",
            headers: {
                'auth-token': localStorage.getItem('token'),
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ title, description, tag })
        })
        const note = await response.json();
        setNotes(notes.concat(note))
    }

    // delete a note

    const deleteNote = async (id) => {
        //TODO: API call
        console.log(id)

        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                'content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })

        const json= await response.json();
        console.log(json);

        const newNotes = notes.filter((note) => {
            return note._id !== id
        })
        setNotes(newNotes)
    }

    // edit a note

    const editNote = async (id, title, description, tag) => {
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                'auth-token': localStorage.getItem('token'),
                'content-type': 'application/json'
                // 'accept': 'application/json'
            },
            body: JSON.stringify({ title, description, tag })
        })
        const json = await response.json()
        console.log(json)

        setNotes(notes.map(note => (
            note._id === id ? { ...note, title, description, tag } : note
        )))
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;