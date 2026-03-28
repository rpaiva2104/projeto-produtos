require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');

const app = express();

// =============================
// ⚙️ MIDDLEWARES
// =============================
app.use(cors()); // Libera o acesso para o seu frontend no Render
app.use(express.json()); // Essencial para ler o corpo (body) das requisições POST
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

// Rota inicial
app.get('/', (req, res) => {
    res.send('🚀 API de Produtos rodando com sucesso!');
});

// Listar todos os produtos
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
});

// Cadastrar novo produto (POST) - IMPORTANTE PARA O SEU FRONTEND
app.post('/produtos', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        res.status(400).json({ erro: "Erro ao cadastrar produto", detalhes: error.message });
    }
});

// Deletar um produto (DELETE)
app.delete('/produtos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Produto.findByIdAndDelete(id);
        res.json({ mensagem: "Produto removido com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar:", error);
        res.status(500).json({ erro: "Erro ao deletar produto" });
    }
});

// =============================
// 🔌 CONEXÃO E INICIALIZAÇÃO
// =============================
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ ERRO: A variável MONGO_URI não foi encontrada.");
} else {
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Conectado ao MongoDB");
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Erro fatal de conexão:", err);
        process.exit(1);
    });
}