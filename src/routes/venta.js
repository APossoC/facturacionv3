const express = require('express');
const router = express.Router();
const poolBd = require('../database');
const helpers = require('../lib/helpers');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const clientes = await poolBd.query('SELECT * FROM cliente');
    const vendedor = await poolBd.query('SELECT * FROM vendedor');
    //  const dui = clientes[0].dui
    //const cliente_seleccionado = await poolBd.query('SELECT * FROM cliente WHERE dui = ?', [dui]);
    console.log(req.body.selectCliente);
    res.render('venta/vender', { clientes, vendedor });
});

router.post('/clientes', isLoggedIn, async (req, res) => {
    console.log(req.body.selectCliente);
    res.render('venta/vender');
});


module.exports = router;