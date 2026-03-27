require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// =============================
// ⚙️ MIDDLEWARES
// =============================
app.use(express.json());
app.use(express.static('public'));

// =============================
// 📦 MODEL (PRODUTO) - Definição Única
// =============================
const produtoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    descricao: String,
    categoria: String,
    estoque: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Evita erro de redeclaração do modelo se o script reiniciar
const Produto = mongoose.models.Produto || mongoose.model('Produto', produtoSchema);

// =============================
// 🏠 ROTAS
// =============================
app.get('/', (req, res) => {
    res.send('🚀 API de Produtos rodando com sucesso!');
});

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
});

// =============================
// 🔌 CONEXÃO E INICIALIZAÇÃO
// =============================
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ ERRO: A variável MONGO_URI não foi encontrada no .env ou no Render.");
} else {
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Conectado ao MongoDB");
        
        // No Render, é obrigatório usar o host '0.0.0.0'
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Erro fatal de conexão:", err);
        process.exit(1);
    });
}