import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    noteService
      .getAll()
      .then(initialResponse => {
        setNotes(initialResponse);
      })
  }, []);

  const toggleImportance = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find(n => n.id === id);
    const changedNote = {...note, important: !note.important};

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note));
      })
      .catch(error => {
        alert(`the note '${note.content}' was already deleted from the server`);
        setNotes(notes.filter(n => n.id !== id));
      })
  }

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: `${notes.length + 1}`
    };

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note => 
        < Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)}/>
      )}
      </ul>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'important' : 'all'}
        </button>
        </div>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>
    </div>
  );
};

export default App;