require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');
const setupSwagger = require('./swagger');  
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to RTB Employee Management API');
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));

// Swagger docs setup
setupSwagger(app); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
