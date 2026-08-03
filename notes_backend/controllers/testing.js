const router = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

router.post('/reset', async (request, response) => {
  await Note.deleteMany({});
  console.log('note reset successful');
  await User.deleteMany({});
  console.log('user reset successful');

  response.status(204).end();
});

module.exports = router;