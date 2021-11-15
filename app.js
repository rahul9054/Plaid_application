const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const util = require('util');
const plaid = require('plaid');

const app = express();
app.use(bodyParser.json());

const plaidClient = new plaid.Client({
  clientID: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  env: plaid.environments.sandbox,
});

let global_token = null;

const User = require('./models/User');
const authenticateUser = require('./middlewares/authenticateUser');

require('./startup/db')();
require('./startup/middleware')(app);

// cookie session
app.use(
  cookieSession({
    keys: ['randomStringASyoulikehjudfsajk'],
  })
);

// route for serving frontend files

app
  .get('/', (req, res) => {
    res.render('index');
  })
  .get('/login', (req, res) => {
    res.render('login');
  })
  .get('/register', (req, res) => {
    res.render('register');
  })

  .get('/home', authenticateUser, (req, res) => {
    res.render('home', { user: req.session.user });
  });

// route for handling post requirests
app
  .post('/login', async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) return res.send('Please enter all the fields');

    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits) return res.send('invalid username or password');

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) return res.send('invalid useranme or password');

    // else he\s logged in
    req.session.user = {
      email,
    };

    res.redirect('/home');
  })
  .post('/register', async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) return res.send('Please enter all the fields');

    const doesUserExitsAlreay = await User.findOne({ email });

    if (doesUserExitsAlreay)
      return res.send(
        'A user with that email already exits please try another one!'
      );

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ email, password: hashedPassword });

    latestUser
      .save()
      .then(() => {
        res.send('registered account!');
        res.redirect('/login');
      })
      .catch((err) => console.log(err));
  });

//logout
app.get('/logout', authenticateUser, (req, res) => {
  req.session.user = null;
  global_token = null;
  res.redirect('/login');
});

app.get('/plaid', async (req, res) => {
  res.sendFile(path.join(__dirname, 'plaid.html'));
});

app.get('/create-link-token', async (req, res) => {
  const { link_token: linkToken } = await plaidClient.createLinkToken({
    user: {
      client_user_id: 'some-unique-identifier',
    },
    client_name: 'App of Tyler',
    products: ['auth', 'identity', 'transactions'],
    country_codes: ['US'],
    webhook: 'https://webhook.example.com',
    language: 'en',
  });

  res.json({ linkToken });
});

app.post('/token-exchange', async (req, res) => {
  const { publicToken } = req.body;
  const { access_token: accessToken } = await plaidClient.exchangePublicToken(
    publicToken
  );
  global_token = accessToken;
  // console.log(global_token);

  res.sendStatus(200);
});

app.get('/balance', async (req, res) => {
  const balanceResponse = await plaidClient.getBalance(global_token)
  .catch((err) => {
  // handle error
});
 
   console.log(balanceResponse);
   if (balanceResponse == undefined) res.redirect('/home') ;
   else {const balance_response = balanceResponse.accounts;
   res.render('balance', { balance_response: balance_response });
   }
});

app.get('/transactions', async (req, res) => {
  const response = await plaidClient
    .getTransactions(global_token, '2018-01-01', '2020-02-01', {})
    .catch((err) => {
      // handle error
    });

    if (response == undefined) res.redirect('/home');
    else res.render('transactions', { response: response.transactions });
});

app.get('/account_details', async (req, res) => {
  const accountDetailResponse = await plaidClient
    .getBalance(global_token)
    .catch((err) => {
      // handle error
    });

  if (accountDetailResponse == undefined) res.redirect('/home');
  else{ const account_detail_response = accountDetailResponse.accounts;
  res.render('account_details', { account_detail_response });
  }
});

// server config
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started listening on port: ${PORT}`);
});
