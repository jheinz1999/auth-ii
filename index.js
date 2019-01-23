const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const knexfile = require('./knexfile');

const server = express();
const db = knex(knexfile.development);

server.use(express.json());

const generateToken = user => {

  const payload = {

    subject: user.id,
    username: user.username

  }

  const secret = process.env.JWT_KEY || 'asjkdfoweyrsajdhfjksadhg';

  const options = {

    expiresIn: 60 * 5

  }

  return new Promise((res, rej) => {

    jwt.sign(payload, secret, options, (err, token) => {

      if (err)
        rej(err);

      else
        res(token);

    });

  });

}

const protected = (req, res, next) => {

  const token = req.get('Authorization');

  if (token) {

    jwt.verify(token, process.env.JWT_KEY || 'asjkdfoweyrsajdhfjksadhg', (err, decoded) => {

      if (err) {

        res.status(401).json({message: 'Invalid token!'});

      }

      else {

        req.token = decoded;
        next();

      }

    });

  }

  else
    res.status(400).json({message: 'no token provided!'});

}

server.get('/api/users', protected, async (req, res) => {

  try {

    const user = await db.select('department').from('users').where({ username: req.token.username}).first();

    const users = await db.select('id', 'username', 'department').from('users').where({ department: user.department });

    res.status(200).json(users);

  }

  catch (err) {

    res.status(500).json({message: 'internal error'});

  }

});

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

server.post('/api/login', async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {

    res.status(400).json({message: 'invalid request'});
    return;

  }

  try {

    const user = await db.select().from('users').where({ username }).first();

    if (user) {

      const correct = await bcrypt.compare(password, user.password);

      if (correct) {

        const token = await generateToken(user);

        res.status(200).json({message: 'authorized!', token});
        return;

      }

    }

  }

  catch (err) {

    res.status(500).json({message: 'internal error'});

  }

  res.status(401).json({message: 'Invalid credentials'});

});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log('Server running'));
