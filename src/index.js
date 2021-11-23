const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const { Pool } = require('pg');

const pool = new Pool({
  database: 'mrcoffee_express',
  user: 'mrcoffee_user',
  password: 'mrCoffee',

  host: 'localhost',
  port: 5432,

});

pool.connect();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const authToken = req.cookies.AuthToken;
  req.userData = authTokens[authToken];

  next();
});

app.use(express.static('src'));
app.use('/scripts', express.static('node_modules'));
app.set('views', './views');
app.set('view engine', 'ejs');

const getHashedPassword = (password) => {
  const hash = bcrypt.hashSync(password, saltRounds);

  return hash;
};

app.get('/login', (req, res) => {
  res.render('login', { welcomeText: 'Welcome to login website', message: '', errorText: '' });
});

app.get('/signup', (req, res) => {
  res.render('signup', { welcomeText: 'Welcome to register website', errorText: '' });
});

app.post('/signup', (req, res) => {
  const {
    email, firstname, lastname, password, confirm_password,
  } = req.body;

  if (password !== confirm_password) {
    res.render('signup', {
      errorText: 'Password does not match.',
    });
    return;
  }
  const hashPassword = getHashedPassword(password);

  const query = `INSERT INTO users (firstname, lastname, email, password)
    VALUES('${firstname}', '${lastname}', '${email}', '${hashPassword}')`;
  console.log(query);

  pool.query(query, (dbErr, dbRes) => {
    if (dbErr === undefined) {
      res.render('login', {
        message: 'Register success. Please Login',
        welcomeText: 'Welcome to login website',
        errorText: '',
      });
    } else if (dbErr.constraint === 'uniqueEmail') {
      // console.log(dbErr);
      res.render('signup', {
        errorText: 'Provided email already exists',
        welcomeText: 'Welcome to register website',
      });
    } else {
      res.render('signup', {
        errorText: 'upps, someting goes wrong',
        welcomeText: 'Welcome to register website',
      });
    }
  });
});

const generateAuthToken = () => crypto.randomBytes(30).toString('hex');
const authTokens = {};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  const query = `SELECT email, password, firstname, lastname, user_id FROM users WHERE email = '${email}' `;

  pool.query(query, (dbErr, dbRes) => {
    // console.log(dbErr)

    if (dbRes.rowCount === 0) {
      res.render('login', { message: '', errorText: 'Incorect data try agin. Don\'t have account? Create new!', welcomeText: 'Welcome to login website' });
    }
    const userData = dbRes.rows[0];
    // console.log(userData);
    const passwordCorrect = bcrypt.compareSync(password, userData.password);

    if (email === userData.email && passwordCorrect === true) {
      const authToken = generateAuthToken();
      authTokens[authToken] = userData;
      res.cookie('AuthToken', authToken);
      res.redirect('home');
    } else if (email !== userData.email || passwordCorrect === false) {
      // console.log(dbErr);
      res.render('login', { message: '', errorText: 'Incorect data try agin. Don\'t have account? Create new!', welcomeText: 'Welcome to login website' });
    } else {
      res.render('login', { message: '', errorText: 'upps, someting goes wrong', welcomeText: 'Welcome to login website' });
    }
  });
});

app.get('/home', (req, res) => {
  if (req.userData) {
    pool.query(
      `SELECT firstname, lastname, users.user_id, day, to_char(start_at, 'HH24:MI') as start_at,
      to_char(end_at, 'HH24:MI') as end_at  FROM users
        JOIN schedules ON users.user_id = schedules.user_id`, (dbErr, dbRes) => {
        res.render('home', {
          errorText: '', welcomeText: 'Welcome ', schedules: dbRes.rows, userData: req.userData,
        });
      },
    );
  } else {
    res.render('login', { welcomeText: 'Welcome to login website', message: 'Please login to continue', errorText: '' });
  }
});

app.get('/login/schedules', (req, res) => {
  if (req.userData) {
    const { userData } = req;
    const query = `SELECT schedule_id, day, to_char(start_at, 'HH24:MI') as start_at,
    to_char(end_at, 'HH24:MI') as end_at FROM schedules WHERE user_id = ${userData.user_id}`;
    pool.query(query, (dbErr, dbRes) => {
      res.render('loggedUserSchedules', {
        welcomeText: 'Welcome ', userData, userSchedules: dbRes.rows, errorText: '',
      });
    });
  } else {
    res.redirect('/home');
  }
});

app.get('/login/schedules/delete/:id', (req, res) => {
  if (req.userData) {
    const schedule_id = req.params.id;
    const query = `DELETE FROM schedules WHere schedule_id = ${schedule_id}`;
    pool.query(query, () => {
      res.redirect('/login/schedules');
    });
  }
});

app.post('/login/schedules', (req, res) => {
  if (req.userData) {
    const { userData } = req;
    const { day, start_at, end_at } = req.body;
    const querySel = `SELECT schedule_id, day, to_char(start_at, 'HH24:MI') as start_at,
    to_char(end_at, 'HH24:MI') as end_at FROM schedules WHERE user_id = ${userData.user_id}`;

    const query = `INSERT INTO schedules (user_id, day, start_at, end_at)
      VALUES('${userData.user_id}', '${day}', '${start_at}', '${end_at}')`;

    pool.query(querySel, (dbErr, dbRes) => {
      const schedules = dbRes.rows;
      let noColision = true;
      schedules.forEach((schedule) => {
        const d = schedule.day.toString();
        if (d === day) {
          noColision = ((schedule.start_at > start_at) && (end_at < schedule.start_at) && (start_at < end_at))
            || ((start_at > schedule.end_at) && (end_at > start_at));
        }
      });
      if (noColision === true) {
        pool.query(query, () => {
          res.redirect('/login/schedules');
        });
      } else {
        res.render('loggedUserSchedules', {
          welcomeText: 'Welcome ',
          userData,
          userSchedules: dbRes.rows,
          errorText: 'The user is already on the schedule for that day',
        });
      }
    });
  }
});

app.get('/users/:id/schedules', (req, res) => {
  const user_id = req.params.id;

  pool.query(
    `SELECT firstname, lastname, email, users.user_id, day, to_char(start_at, 'HH24:MI') as start_at,
    to_char(end_at, 'HH24:MI') as end_at FROM users
    JOIN schedules ON users.user_id = schedules.user_id WHERE users.user_id = ${user_id}`, (dbErr, dbRes) => {
      console.log(dbErr);
      console.log(dbRes);

      const userSchedules = dbRes.rows;
      res.render('userSchedules', { welcomeText: 'Schedules of', userSchedules });
    },
  );
});

app.get('/logout', (req, res) => {
  if (req.userData) {
    res.clearCookie('AuthToken');
    delete authTokens[req.cookies.AuthToken];
  }
  res.redirect('/login');
});

const port = 3000;
app.listen(
  3000,
  () => {
    console.log(`Example app listening at http://localhost:${port}`);
  },
);
