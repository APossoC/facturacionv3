const express = require('express');
const router = express.Router();
const poolBd = require('../database');
const {isLoggedIn}= require('../lib/auth');

router.get('/',isLoggedIn, async (req, res) => {
    const clientes = await poolBd.query('SELECT * FROM cliente');
    res.render('clientes/list', { clientes });
});

router.get('/add',isLoggedIn, (req, res) => {
    res.render('clientes/add');
});

router.post('/add',isLoggedIn, async (req, res) => {
    const { dui, nombre_completo, direccion, telefono } = req.body;
    const nuevoCliente = {
        dui,
        nombre_completo,
        direccion,
        telefono
    };
    await poolBd.query('INSERT INTO cliente SET ?', [nuevoCliente]);
    req.flash('realizado','Cliente guardado satificactoriamente');
    res.redirect('/clientes');
});

router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;   
    await poolBd.query('DELETE FROM cliente WHERE ID = ?',[id]);
    req.flash('realizado','Cliente eliminado satificactoriamente');
    res.redirect('/clientes');      
});

router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await poolBd.query('SELECT * FROM cliente WHERE ID = ?',[id]);
    //console.log(links[0]);
    res.render('clientes/edit',{link: links[0]});   
    
});

router.post('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { dui, nombre_completo, direccion, telefono } = req.body;
    const editarClientes = {
        dui,
        nombre_completo,
        direccion,
        telefono
    };
    await poolBd.query('UPDATE cliente SET ? WHERE id = ?',[editarClientes,id]); 
    req.flash('realizado','Cliente actualizado satificactoriamente');
    res.redirect('/clientes');
    //console.log('Actualizado Id:',{id});

});





module.exports = router;