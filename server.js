require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

// =============================
// 🔌 CONEXÃO COM MONGODB
// =============================
async function conectarDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ Conectado ao MongoDB")
    } catch (err) {
        console.error("❌ Erro ao conectar:", err)
        process.exit(1) // encerra app se falhar
    }
}

conectarDB()

// =============================
// 📦 MODEL (PRODUTO)
// =============================
const Produto = mongoose.model('Produto', {
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    descricao: String,
    categoria: String,
    estoque: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// =============================
// 🏠 ROTA RAIZ (IMPORTANTE)
// =============================
app.get('/', (req, res) => {
    res.send('🚀 API de Produtos rodando com sucesso!')
})
app.get('/produtos', async (req, res) => {
    const produtos = await Produto.find()
    res.json(produtos)
})