import React from 'react'
import noteContext from '../context/notes/noteContext';
import { useState , useContext } from 'react';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote]= useState({
        title: "",
        description: "",
        tag: "default"
    })

    const handleClick= (e)=>{
        e.preventDefault()
        addNote(note.title, note.description, note.tag);
        props.showAlert("Added successfully", "success");
    }

    const onChange= (e)=>{
        setNote({...note, [e.target.name] : e.target.value})
    }

    return (
        <div className="container my-3">
            <h2>Add a note</h2>
            <div className="container my-3">
                <form autocomplete="off">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" onChange={onChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input type="text" className="form-control" id="description" name="description" onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tag">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" onChange={onChange}/>
                    </div>

                    <button style={{cursor: "pointer"}} disabled={note.title.length<3 || note.description.length<5} type="submit" className="btn btn-primary" onClick = {handleClick}>Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote