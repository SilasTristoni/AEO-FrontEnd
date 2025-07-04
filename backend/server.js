const express = require('express');
const cors = require('cors');
const app = express();
const database = require('./config/database.js');

// Middlewares
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// Carrega os modelos e associações
require('./models');

// Rotas da Aplicação
const usersRoutes = require('./routes/usersRoutes.js');
const categoriesRoutes = require('./routes/categoriesRoutes.js');
const productsRoutes = require('./routes/productsRoutes.js');
const ordersRoutes = require('./routes/ordersRoutes.js');

app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// Documentação
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');
app.get('/', (req, res) => res.redirect('/api-docs'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Tratamento de Rota Não Encontrada
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicialização
const PORT = process.env.PORT || 3001;
database.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`----------- SERVIDOR INICIADO NA PORTA ${PORT} -----------`);
      console.log('Banco de dados conectado e sincronizado.');
    });
  })
  .catch(err => {
    console.error('!!!!!!!!!! FALHA AO INICIAR O SERVIDOR !!!!!!!!!!');
    console.error('Erro ao conectar com o banco:', err.message);
  });