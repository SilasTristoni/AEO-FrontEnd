const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // 1. Importe o bcrypt diretamente aqui
const asyncHandler = require('express-async-handler')

// @desc    Registrar um novo usuário
// @route   POST /users/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Por favor, preencha todos os campos.');
  }

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('Este email já está cadastrado.');
  }

  // O hook no modelo vai cuidar de criptografar a senha
  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
  });
});


exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // A comparação explícita acontece aqui
    if (user && (await bcrypt.compare(password, user.password))) {
        
        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.status(200).json({ token });

    } else {
        res.status(401);
        throw new Error('Email ou senha inválidos.');
    }
});

// Obter informações do usuário logado (exemplo de rota protegida)
exports.getMe = asyncHandler(async (req, res) => {
    // req.user é adicionado pelo middleware de autenticação
    const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email'], // Não retornar a senha
    });

    if (!user) {
        res.status(404);
        throw new Error('Usuário não encontrado.');
    }
    
    res.status(200).json(user);
});

