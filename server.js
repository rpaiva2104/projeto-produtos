require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');

const app = express();

// =============================
// ⚙️ MIDDLEWARES
// =============================
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('public'));

// =============================
// 📦 MODEL (PRODUTO)
// =============================
const produtoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    descricao: String,
    categoria: String,
    estoque: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Produto = mongoose.models.Produto || mongoose.model('Produto', produtoSchema);

// =============================
// 🏠 ROTAS
// =============================

// Rota para LISTAR produtos (Aceita GET / e GET /produtos)
app.get(['/', '/produtos'], async (req, res) => {
    try {
        const produtos = await Produto.find().sort({ createdAt: -1 });
        // Se for a raiz e não vier do fetch (navegador acessando), enviamos um aviso
        if (req.path === '/' && !req.headers['accept'].includes('application/json')) {
            return res.send('🚀 API de Produtos rodando! Use /produtos para ver os dados.');
        }
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
});

// Rota para CADASTRAR produtos (Aceita POST / e POST /produtos)
// Isso resolve o erro "Cannot POST /" se o seu frontend apontar para a raiz
app.post(['/', '/produtos'], async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        res.status(400).json({ erro: "Erro ao cadastrar produto", detalhes: error.message });
    }
});

// Rota para DELETAR um produto
app.delete('/produtos/:id', async (req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id);
        res.json({ mensagem: "Produto removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar produto" });
    }
});

// =============================
// 🔌 CONEXÃO E INICIALIZAÇÃO
// =============================
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ ERRO: Variável MONGO_URI não encontrada no Render.");
} else {
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Conectado ao MongoDB");
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor ativo na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Erro de conexão:", err);
        process.exit(1);
    });
}