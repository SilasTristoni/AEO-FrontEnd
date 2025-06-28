const path = require('path');
const { Json } = require('sequelize/lib/utils');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API da Loja Online',
      version: '1.0.0',
      description: 'Documentação da API para o projeto final',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // O caminho para os arquivos de rotas que contêm a documentação
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);
console.log(Json.stringify(swaggerSpec, null, 2)); // Log para verificar a estrutura do JSON

module.exports = swaggerSpec;