// Call/Import  Dependencies
const express = require('express');
const path = require('path');
const expbs = require('express-handlebars');
const db = require('./models');

const app = express(); // Start Express
const PORT = process.env.PORT || 5000 // Set Port

// Identify the use of Handlebars
app.engine('handlebars', expbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// Handle Post Response
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static Route
app.use(express.static(path.join(__dirname, 'public')));
// html-routes
app.use(require('./routes/html-routes'));
// api-routes
app.use('/api', require('./routes/api-routes'));
// Initialise server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`The Express Server is now Up and running on PORT : ${PORT}`));
});
