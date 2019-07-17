const express = require('express');
const router = express.Router();
const poolBd = require('../database');

router.get('/add', (req, res) => {
    res.render('clientes/add');
});

router.post('/add', async (req, res) => {
    const { dui, nombre_completo, direccion, telefono } = req.body;
    const newLink = {
        dui,
        nombre_completo,
        direccion,
        telefono
    };
    await poolBd.query('INSERT INTO cliente SET ?', [newLink]);
    console.log(newLink);
    //console.log(req.body); 
    res.send('recibido');

});

router.get('/', async (req, res) => {
    const clientes = await poolBd.query('SELECT * FROM cliente');
    //console.log(clientes); 
    //res.send('Las listas iran aqui');
    res.render('clientes/list', { clientes });
});


module.exports = router;