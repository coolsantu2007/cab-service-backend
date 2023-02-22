const express = require('express');
const app = express();
const cors = require('cors')
var path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const NODE_ENV = process.env.NODE_ENV || "development";
const compression = require('compression')

require('dotenv').config({ path: '.env.' + NODE_ENV });
const PORT = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
console.log(`Your env is ${process.env.NODE_ENV}`);
app.use(cors());
app.set('view engine', 'html');
app.set("locale", "en");

global.LOCALE = app.get("locale");

app.set("env", process.env);
global.ENV = app.get("env");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(compression())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', false);
  res.removeHeader("X-Powered-By");
  next();
});

const webRoutes = require('./route/v1/webRouter');
const helper = require('./configuration/helper');

app.use('/api/v1', webRoutes);

//checking routes
app.get('/', async (req, res) => {
  res.send('API is working fine with' + (` ${NODE_ENV} env, {v1}`))
});

//connecting database
mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => {
  console.log("database connected")
});

//(error handling ) when errors will be occur
mongoose.connection.on('error', (err) => {
  console.log("err connecting", err)
});

//setting up custom error message for routes 
app.use((req, res, next) => {
  const error = new Error('This APIs does not exist');
  error.status = 404;
  next(error);
});

//Error handler function`
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

//callig server
app.listen(PORT, () => {
  console.log("server is running on", PORT)
});