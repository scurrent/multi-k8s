const keys = require('./keys');


//EXPRESS APP Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


//POstgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPort,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost Postgres connection'));
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err));

//redis Client Setup

const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000

});

const redisPublisher = redisClient.duplicate();


//Express Route Handlers

app.get('/', (req, res)=> {
  res.send('You got the root');
});

app.get('/values/all', async (req, res)=> {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});


app.get('/values/current', async (req, res)=> {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;
  if(parseInt(index) > 40){
    return res.status(422).send('Index is too high - please lower than ' + index);
  }
  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({working: true});
});

app.listen(5000, err => {
  console.log('Listening....');
});