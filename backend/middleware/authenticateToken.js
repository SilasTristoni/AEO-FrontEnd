const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'minha-chave-ultra-secreta-123'; // Nova chave para garantir

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Falha na verificação do token:', err.message);
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    
    req.user = { id: decoded.id, name: decoded.name };  
    next();
  });
}

module.exports = authenticateToken;