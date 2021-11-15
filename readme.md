# Plaid_Application

Project Features:
1) User signup, login, logout APIs.
2) Token exchange API: An authenticated user can submit a plaid public token that he gets post link integration.
3) This public token is exchanged for access token on the backend.
4) This initiates an async job on the backend for fetching account and item metadata for the access token.
5) Expose a webhook for handling plaid transaction updates and fetch the transactions on receival of a webhook.
6) Expose an api endpoint for fetching all transaction and account data each for a user.
7) Do appropriate plaid error handling.

## Project Link

- [https://plaid-application.herokuapp.com/](https://plaid-application.herokuapp.com/)

## Running Application Locally

- `npm install`
- `nodemon server.js`
- Make sure to add environment variables!


<blockquote>
  Rahul Khandelwal<br>
  Email: khandelwalrahul1607@gmail.com
</blockquote>

<div align="center">
    <h3>====Thank You!====</h3>
</div>
