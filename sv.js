require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path')

const app = express();
const PORT = 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if(err) {
    console.error("Erro ao conectar ao banco de dados")
    return
    }
    console.log("Conectado ao MySQL")
});


app.post('/encurtar', (req, res) => {
    const { inputName, inputUrl } = req.body;

    if(!inputName || ! inputUrl) {
        return res.status(400).json({erro: "Nome e URL são obrigatórios" })
    }

    const sql = "INSERT INTO links (nome, url) VALUES (?, ?)";
    db.query(sql, [inputName, inputUrl], (err, result) => {
        if (err) {
            console.error("Erro ao inserir no banco:", err);
            return res.status(500).json({ error: "Erro ao salvar no banco" });
        }
        
        const linkCurto = `http://localhost:3000/${inputName}`;

        res.status(201).json({ message: "Link encurtado com sucesso!", linkCurto });

    });

    app.get('/:inputName', (req, res) => {
        const { inputName } = req.params;

    
        db.query("SELECT url FROM links WHERE nome = ?", [inputName], (err, result) => {
            if (err) {
                console.error("Erro ao buscar no banco:", err);
                return res.status(500).json({error: "erro ao buscar o link"})
            }

            if (result.length === 0 ) {
                return res.status(400).json({error: "Link nao encontrado"})
            }

            const originalUrl = result[0].url;
            res.redirect(originalUrl);
        })
    })
    
})

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));