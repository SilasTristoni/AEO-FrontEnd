const User = require('../models/users');
const Order = require('../models/orders'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const JWT_SECRET_KEY = 'minha-chave-ultra-secreta-123'; // Nova chave para garantir

class UserController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await User.create({ name, email, password: hashedPassword });

            res.status(201).json({ message: 'Usuário criado com sucesso.', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar usuário.', detalhes: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Senha inválida.' });
            }

            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET_KEY, { expiresIn: '1h' });
            res.json({ message: 'Login realizado com sucesso.', token });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao realizar login.', detalhes: error.message });
        }
    }

    // O restante das funções não precisa ser alterado...
    
    static async findAllUsers(req, res) {
        try {
            const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuários.', detalhes: error.message });
        }
    }
}

module.exports = UserController;