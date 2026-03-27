require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

// =============================
// 🔌 CONEXÃO COM MONGODB
// =============================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Conectado ao MongoDB"))
.catch(err => console.error("❌ Erro ao conectar:", err))

// =============================
// 📦 MODEL (PRODUTO)
// =============================
const Produto = mongoose.model('Produto', {
    nome: String,
    preco: Number,
    descricao: String,
    categoria: String,
    estoque: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// =============================
// 🚀 ROTAS (API REST)
// =============================

// 🔍 Listar todos os produtos
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find()
        res.json(produtos)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

// 🔍 Buscar produto por ID
app.get('/produtos/:id', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id)
        if (!produto) return res.status(404).json({ msg: "Produto não encontrado" })
        res.json(produto)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

// ➕ Criar produto
app.post('/produtos', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body)
        const produtoSalvo = await novoProduto.save()
        res.status(201).json(produtoSalvo)
    } catch (error) {
        res.status(400).json({ erro: error.message })
    }
})

// ✏️ Atualizar produto
app.put('/produtos/:id', async (req, res) => {
    try {
        const produtoAtualizado = await Produto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json(produtoAtualizado)
    } catch (error) {
        res.status(400).json({ erro: error.message })
    }
})

// ❌ Deletar produto
app.delete('/produtos/:id', async (req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id)
        res.json({ msg: "Produto removido com sucesso" })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

// =============================
// 🌐 SERVIDOR
// =============================
const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
})