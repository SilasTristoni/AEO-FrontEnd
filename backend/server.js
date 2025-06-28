const express = require('express');
const cors = require('cors'); // Adicionado
const app = express();
const database = require('./config/database.js');

app.use(cors()); // Adicionado
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const productsRoutes = require('./routes/productsRoutes.js');
const usersRoutes = require('./routes/usersRoutes.js');
const categoriesRoutes = require('./routes/categoriesRoutes.js');
const ordersRoutes = require('./routes/ordersRoutes.js');

require('./models/associations'); // Garante que as associações sejam carregadas

database.db.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados conectado com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  });

app.get('/', (req, res) => {
  res.send('API final do Jackson rodando! Docs disponíveis em /api-docs');
});

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');

app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});


const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});