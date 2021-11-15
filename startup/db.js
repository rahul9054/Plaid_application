const mongoose = require('mongoose');

module.exports = () => {
   // mongdb cloud connection is here
  mongoose
    .connect(
      'mongodb+srv://Rahul1607:ObkNX63F5CsMZCJa@cluster0.kxnzw.mongodb.net/Plaid?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    )
    .then(() => {
      console.log('connected to mongodb cloud! :)');
    })
    .catch((err) => {
      console.log(err);
    }); 
};
