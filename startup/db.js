const mongoose = require('mongoose');

module.exports = () => {
   // mongdb cloud connection is here
  mongoose
    .connect("DB_URL",
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
