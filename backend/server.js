// 1. Importações de pacotes e configuração inicial
const express = require('express');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const cors = require('cors');

// 2. Importação dos nossos módulos (rotas, db, error handler)
const db = require('./models'); // <-- CORREÇÃO AQUI! Apenas './models'
const userRoutes = require('./routes/usersRoutes');
const categoryRoutes = require('./routes/categoriesRoutes');
// const productRoutes = require('./routes/productRoutes'); // Descomente quando tiver as rotas de produtos
const errorHandler = require('./middleware/errorHandler');

// 3. Inicialização do Express
const app = express();

// 4. Configuração de Middlewares
app.use(cors()); // Permite requisições de origens diferentes (do seu frontend)
app.use(express.json()); // Permite que o express entenda JSON no corpo das requisições
app.use(express.urlencoded({ extended: true }));

// 5. Definição das Rotas Principais
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
// app.use('/products', productRoutes); // Descomente quando tiver as rotas de produtos

// Rota de "boas-vindas" para testar se o servidor está no ar
app.get('/', (req, res) => {
    res.send('API da Loja AEO no ar!');
});

// 6. Middleware de Tratamento de Erros (deve ser o último)
app.use(errorHandler);

// 7. Sincronização com o Banco de Dados e Inicialização do Servidor
const PORT = process.env.PORT || 3000;

db.sequelize.sync() // Sincroniza todos os modelos com o banco de dados
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log('Conexão com o banco de dados estabelecida com sucesso.');
        });
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });
