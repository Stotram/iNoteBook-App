import { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

import React from 'react';

const Notes = (props) => {
    const history= useNavigate();
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        if (localStorage.getItem('token')){
            getNotes()
        }
        else {
            history("/login");
        }
        //eslint-disable-next
    }, [])

    const ref = useRef(null);
    const refClose= useRef(null);

    const [note, setNote]= useState({
        etitle: "",
        edescription: "",
        etag: "default",
        id: ""
    })

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag,
            id: currentNote._id
        })
    }

    const handleClick= async(e)=>{
        e.preventDefault()
        await editNote(note.id, note.etitle, note.edescription, note.etag)
        getNotes()
        refClose.current.click()
        props.showAlert("Updated successfully", "success")
    }

    const onChange= (e)=>{
        setNote({...note, [e.target.name] : e.target.value})
    }

    return (
        <>
            <AddNote showAlert={props.showAlert}/>
            <button ref={ref} type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="etitle">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" value={note.etitle} onChange={onChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edescription">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="etag">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" style= {{cursor: "pointer"}} ref={refClose} className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" style= {{cursor: "pointer"}} onClick={handleClick} className="btn btn-primary">Update note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h2>Your Notes</h2>
                <div className="row my-3">
                    {notes.map((note) => {
                        return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                    })}
                </div>
            </div>
        </>
    )
}

export default Notes