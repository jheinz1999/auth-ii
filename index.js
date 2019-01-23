const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');

const knexfile = require('./knexfile');

const server = express();
const db = knex(knexfile.development);

server.use(express.json());

server.post('/api/register', async (req, res) => {

  let { username, password, department } = req.body;

  if (!username || !password || !department) {

    res.status(400).json({message: 'invalid data in request body'});
    return;

  }

  try {

    password = await bcrypt.hash(password, 2);

    const [id] = await db.insert({ username, password, department }).into('users');

    const user = await db.select('id', 'username', 'department').from('users').where({ id }).first();

    res.status(201).json(user);

  }

  catch (err) {

    res.status(500).json({message: 'internal error'});

  }

});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log('Server running'));
