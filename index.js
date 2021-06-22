const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const mysql = require('mysql2');
const { json } = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({message: 'funcionando!!!'}));
app.use('/', router);

//iniciar o servidor
app.listen(port);
console.log('API funcionando!');

function execSQLQuery(sqlqry, res) {
    const connection = mysql.createConnection({
        host    : 'localhost',
        port    : 3307,
        user    : 'root',
        password: '123',
        database: 'senai115'
    });

    connection.query(sqlqry, function(error, results, fields){
        if(error)
            res.json(error);
        else
            res.json(results);
            connection.end();
            console.log("Executou!")
    });
}

router.get('/clientes', (req, res) => {
    execSQLQuery('SELECT * from clientes', res);
})

router.get('/clientes/:id?', (req, res) => {
    let filter = '';
    if(req.params.id) filter = ' WHERE id=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM clientes' + filter, res);
});

router.delete('/clientes/:id', (req, res) =>{
    execSQLQuery('DELETE FROM clientes WHERE id=' + parseInt(req.params.id), res);
});

router.post('/clientes', (req, res) => {
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    execSQLQuery(`INSERT INTO clientes (nome, cpf) VALUES ('${nome}','${cpf}')`, res);
});

router.patch('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    execSQLQuery(`UPDATE clientes SET nome='${nome}' cpf='${cpf}' WHERE id=${id}`, res)
});