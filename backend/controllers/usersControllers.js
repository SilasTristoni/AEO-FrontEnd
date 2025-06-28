const User = require('../models/users');
const Order = require('../models/orders');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const JWT_SECRET_KEY = 'CHAVE SECRETA DO JWT'; // Lembre-se de trocar por uma chave mais segura em produção

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

    static async createUser(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await User.create({ name, email, password: hashedPassword });

            res.status(201).json({ id: user.id, name: user.name, email: user.email });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar usuário.', detalhes: error.message });
        }
    }

    static async findAllUsers(req, res) {
        try {
            const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuários.', detalhes: error.message });
        }
    }

    static async findUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, { attributes: ['id', 'name', 'email'] });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuário.', detalhes: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            if (name) user.name = name;
            if (email) user.email = email;

            if (password) {
                user.password = await bcrypt.hash(password, saltRounds);
            }

            await user.save();
            res.json({ id: user.id, name: user.name, email: user.email });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar usuário.', detalhes: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            await user.destroy();
            res.json({ message: 'Usuário excluído com sucesso.' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir usuário.', detalhes: error.message });
        }
    }

    static async findOrdersByUserId(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id, {
                include: {
                    model: Order,
                    as: 'orders'
                },
                 attributes: ['id', 'name', 'email']
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar pedidos do usuário.', detalhes: error.message });
        }
    }
}

module.exports = UserController;