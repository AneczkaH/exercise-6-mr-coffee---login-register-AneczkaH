const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

//const mainHandler = 


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('src'));
app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/login', (req, res) => {
    
    res.render('login', {welcomeText: 'Welcome to our login website'});
   
});

app.get('/signup', (req, res) => {
    
    res.render('signup', {welcomeText: 'Welcome to our register website'});
   
});

app.get('/logged', (req, res) => {
    
    res.render('home', {welcomeText: 'Welcome ${firstname}'});
   
});

app.get('/myschedules', (req, res) => {
    
    res.render('loggedUserSchedules', {welcomeText: 'Welcome ${firstname}'});
   
});

app.get('/users/schedules'/*'/users/:id/schedules'*/, (req, res) => {
/*    const user_id = req.params.id;
    pool.query(
      `SELECT * FROM schedules WHERE user_id = ${user_id}`, (dbErr, dbRes) => {
        const userSchedules = dbRes.rows; */
        res.render('userSchedules'/* , { userSchedules }*/);
 //     },
 //   );
  });


const port = 3000;
app.listen(
    3000,
    () => {
      console.log(`Example app listening at http://localhost:${port}`);
    },
  );