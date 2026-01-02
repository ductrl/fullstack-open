require('dotenv').config()
const mongoose = require('mongoose');

const url = process.env.TEST_MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'Test Note 2',
  important: false,
});

note.save().then(result => {
  console.log('note saved!');
  mongoose.connection.close();
});

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });