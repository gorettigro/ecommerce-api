const { app } = require('./app');

// Utils
const { sequelize } = require('./util/database');
const { initModels } = require('./util/initModels.js');

// Database authenticated
sequelize
  .authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((err) => console.log(err));

// Init relations
initModels();

// Database synced with models' relations
sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.log(err));

// Spin up server
app.listen(process.env.PORT, () => {
  console.log(`Ecommerce Api running succes`);
});