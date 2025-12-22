const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password to the command line');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ductrl:${password}@fullstackopen.2inlmhp.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullStackOpen`;

mongoose.set('strictQuery', false);

mongoose.connect(url, { family: 4, });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  console.log('phonebook:');
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
}
else {
  const newPerson = {
    name: process.argv[3],
    number: process.argv[4],
  };

  const person = new Person(newPerson);

  person.save().then(() => {
    console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`);
    mongoose.connection.close();
  })
}