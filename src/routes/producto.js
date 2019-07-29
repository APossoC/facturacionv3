const express = require('express');
const router = express.Router();
const poolBd = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const producto = await poolBd.query('SELECT * FROM producto');
    res.render('producto/list', { producto });
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { nombre, descripcion, valor_bodega } = req.body;
    const verificacion_producto = await poolBd.query('SELECT * FROM producto WHERE nombre = ? AND descripcion = ?', [nombre, descripcion]);
    if (verificacion_producto[0]) {
        req.flash('importante', 'Ya existe! producto con las caracteristicas sumunistradas');
        res.redirect('/producto');
    } else {
        const nuevoProducto = {
            nombre,
            descripcion,
            valor_bodega
        };
        await poolBd.query('INSERT INTO producto SET ?', [nuevoProducto]);
        req.flash('realizado', 'Producto guardado satificactoriamente');
        res.redirect('/producto');
    }
});


router.post('/delete', isLoggedIn, async (req, res) => {
    const { id_producto } = req.body;
    await poolBd.query('DELETE FROM producto WHERE id_producto = ?', [id_producto]);
    req.flash('realizado', 'Producto eliminado satificactoriamente');
    res.redirect('/producto');
});

router.post('/edit', isLoggedIn, async (req, res) => {
    const { id_producto, nombre, descripcion, valor_bodega } = req.body;
    const editarProducto = {
        nombre,
        descripcion,
        valor_bodega
    };    
    await poolBd.query('UPDATE producto SET ? WHERE id_producto = ?', [editarProducto, id_producto]);
    req.flash('realizado', 'Producto actualizado satificactoriamente');
    res.redirect('/producto');
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