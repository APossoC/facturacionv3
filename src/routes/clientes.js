const express = require('express');
const router = express.Router();
const poolBd = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const clientes = await poolBd.query('SELECT * FROM cliente');
    res.render('clientes/list', { clientes });
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { dui, nombre_completo, direccion, telefono } = req.body;
    const verificacion_cliente = await poolBd.query('SELECT * FROM cliente WHERE dui = ?', [dui]);
    if (verificacion_cliente[0]) {
        req.flash('importante', 'Ya existe! identificacion sumunistrada');
        res.redirect('/clientes');
    } else {
        const nuevoCliente = {
            dui,
            nombre_completo,
            direccion,
            telefono
        };
        await poolBd.query('INSERT INTO cliente SET ?', [nuevoCliente]);
        req.flash('realizado', 'Cliente guardado satificactoriamente');
        res.redirect('/clientes');
    }
});


router.post('/delete', isLoggedIn, async (req, res) => {
    const { id } = req.body;
    await poolBd.query('DELETE FROM cliente WHERE ID = ?', [id]);
    req.flash('realizado', 'Cliente eliminado satificactoriamente');
    res.redirect('/clientes');
});

router.post('/edit', isLoggedIn, async (req, res) => {
    const { dui, nombre_completo, direccion, telefono } = req.body;
    const editarClientes = {
        dui,
        nombre_completo,
        direccion,
        telefono
    };
    const filas = await poolBd.query('SELECT * FROM cliente WHERE dui = ?', [editarClientes.dui]);
    await poolBd.query('UPDATE cliente SET ? WHERE id = ?', [editarClientes, filas[0].id]);
    req.flash('realizado', 'Cliente actualizado satificactoriamente');
    res.redirect('/clientes');
});

/*router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await poolBd.query('DELETE FROM cliente WHERE ID = ?', [id]);
    req.flash('realizado', 'Cliente eliminado satificactoriamente');
    res.redirect('/clientes');
});*/

/*router.get('/add', isLoggedIn, (req, res) => {
    res.render('clientes/add');
});*/

/*router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const clientes = await poolBd.query('SELECT * FROM cliente WHERE ID = ?', [id]);
    //console.log(links[0]);
    res.render('clientes/edit', { cliente: clientes[0] });
});*/

/*router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { dui, nombre_completo, direccion, telefono } = req.body;
    const editarClientes = {
        dui,
        nombre_completo,
        direccion,
        telefono
    };
    await poolBd.query('UPDATE cliente SET ? WHERE id = ?', [editarClientes, id]);
    req.flash('realizado', 'Cliente actualizado satificactoriamente');
    res.redirect('/clientes');
    //console.log('Actualizado Id:',{id});

});*/





module.exports = router;