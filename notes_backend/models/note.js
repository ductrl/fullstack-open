const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as an argument');
    process.exit(1);
}

const password = process.argv[2];

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message);
    });

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

mongoose.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Note', noteSchema);
