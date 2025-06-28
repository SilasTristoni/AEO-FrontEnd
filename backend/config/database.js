const Sequelize = require('sequelize');

class Database {
  constructor() {
   this.init();
    }

    init() {
        this.db = new Sequelize(
            'FinalProject', // Nome do banco de dados
            'root',         // Usuário do banco
            '',             // Senha do banco (deixe em branco se não houver)
            {
                host: 'localhost',
                dialect: 'mysql',
                define: {
                    timestamps: false, // Não cria colunas createdAt e updatedAt
                },
            }
        );
    }
}

module.exports = new Database();