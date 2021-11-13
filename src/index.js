const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const saltRounds = 10;
//var $ = require ('jquery');

//const mainHandler = 
const { Pool, Client } = require('pg');

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
    const authToken = req.cookies['AuthToken'];
    req.userData = authTokens[authToken];

    next();
});


app.use(express.static('src'));
app.set('views', './views');
app.set('view engine', 'ejs');

const getHashedPassword = (password) => {
    //bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        // Store hash in your password DB.
    //});
    const hash = bcrypt.hashSync(password, saltRounds);
    
    return hash;
}

app.get('/login', (req, res) => {
    
    res.render('login', {welcomeText: 'Welcome to login website', message:'', errorText:''});
   
});

app.get('/signup', (req, res) => {
    
    res.render('signup', {welcomeText: 'Welcome to register website', errorText: ''});
   
});

app.post('/signup', (req, res) => {
   
    const { email, firstname, lastname, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        res.render('signup', { errorText: 'Password does not match.',
        //messageClass: 'alert-danger'
        });
        return;
    }
    const hashPassword = getHashedPassword(password) 

    const query = `INSERT INTO users (firstname, lastname, email, password)
    VALUES('${firstname}', '${lastname}', '${email}', '${hashPassword}')`;
    console.log(query);


    pool.query(query, (dbErr, dbRes) => {
    if (dbErr === undefined) {
      res.redirect('login', {message: 'Register success. Please Login', welcomeText: 'Welcome to login website', errorText:''});
    } else if (dbErr.constraint === 'warunek') {
      console.log(dbErr);
      res.render('signup', { errorText: 'Provided email already exists', welcomeText: 'Welcome to register website'});
    } else {
      res.render('signup', { errorText: 'upps, someting goes wrong', welcomeText: 'Welcome to register website' });
    }
    });

});

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}
const authTokens = {};

app.post('/login', (req, res) => {
   
    const { email, password } = req.body;
    console.log(req.body);
    //const hashPassword = getHashedPassword(password); 
    const query = `SELECT email, password, firstname, lastname, user_id FROM users WHERE email = '${email}' `;
    console.log(query)
    pool.query(query, (dbErr,dbRes) => {
        const userData = dbRes.rows[0];
        console.log(userData)

        const passwordCorrect = bcrypt.compareSync(password, userData.password)

        if (email === userData.email && passwordCorrect === true) {
           const authToken = generateAuthToken();
           authTokens[authToken] = userData;
           res.cookie('AuthToken', authToken);
            res.redirect('home');
          } else if (email !== userData.email || passwordCorrect === false) {
            console.log(dbErr);
            res.render('login', { message:'', errorText: 'Incorect data try agin or if you don\'t have account create new', welcomeText: 'Welcome to login website'});
          } else {
            res.render('login', { message:'', errorText: 'upps, someting goes wrong', welcomeText: 'Welcome to login website' });
          }
    });

});
       
    


app.get('/home', (req, res) => {
    if(req.userData) {
    pool.query(
        `SELECT firstname, lastname, users.user_id,day, start_at, end_at FROM users
        JOIN schedules ON users.user_id = schedules.user_id`, (dbErr, dbRes) => {
          res.render('home', { errorText:'', welcomeText: 'Welcome ', schedules: dbRes.rows, userData: req.userData });
        },
    )
    } else {
        res.render('login', {welcomeText:'Welcome to login website', message: 'Please login to continue', errorText:'' })
    } 
});

app.get('/login/schedules', (req, res) => {
    if(req.userData) {
        const userData = req.userData;
        const query =`SELECT day, start_at, end_at FROM schedules WHERE user_id = ${userData.user_id}`;
        pool.query(query, (dbErr, dbRes) => { 
            userSchedules = dbRes.rows;
    res.render('loggedUserSchedules', {welcomeText: 'Welcome ', userData: userData, userSchedules: dbRes.rows});
       });
    }
});

app.post('/login/schedules', (req, res)=>{
    if(req.userData) {
        const userData = req.userData;
    const {day, start_at, end_at} = req.body;
    const query = `INSERT INTO schedules (user_id, day, start_at, end_at)
    VALUES('${userData.user_id}', '${day}', '${start_at}', '${end_at}')`;
    console.log(query);
    
    pool.query(query, (dbErr, dbRes) => {
        if (dbErr === undefined) {
        res.redirect('/login/schedules');
        } else {
            console.log(dbErr)
        }
    });
    }
});

app.get('/users/:id/schedules', (req, res) => {
   const user_id = req.params.id;

   pool.query(
    `SELECT firstname, lastname, email, users.user_id,day, start_at, end_at FROM users
    JOIN schedules ON users.user_id = schedules.user_id WHERE users.user_id = ${user_id}`, (dbErr, dbRes) => {
        console.log(dbErr)
        console.log(dbRes)
        
        //const userSchedules = dbRes.rows; 
        //console.log(userSchedules)
        res.render('userSchedules', { welcomeText: 'Scheduls of', userSchedules: dbRes.rows });
    },
   );
});
 //   pool.query(
   //   `SELECT * FROM schedules WHERE user_id = ${user_id}`, (dbErr, dbRes) => {
     //   const userSchedules = dbRes.rows; 
      //  res.render('userSchedules'/* , { userSchedules }*/);
 //     },
 //   );
  


const port = 3000;
app.listen(
    3000,
    () => {
      console.log(`Example app listening at http://localhost:${port}`);
    },
  );