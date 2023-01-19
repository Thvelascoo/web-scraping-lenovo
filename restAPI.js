// Importando a data e o framework express
const data = require('./dadosFinais.json')
const express = require('express');

// Criando o servidor e a port
const app = express();
const PORT = 8080;

// Utilizando o get e o JSON.stringify para enviar a data gerada pela função scrapingNotebooks
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(data, null, 4))
});

// Abrindo o Servidor na port definida anteriormente
app.listen(PORT, () =>
    console.log(`Server on http://localhost:${PORT}`)
)
