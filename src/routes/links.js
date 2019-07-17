const express = require('express');
const router = express.Router();
const poolBd = require('../database');
const {isLoggedIn}= require('../lib/auth');

router.get('/add',isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add',isLoggedIn, async (req, res) => {
    const { dui, nombre_completo, direccion, telefono } = req.body;
    const newLink = {
        dui,
        nombre_completo,
        direccion,
        telefono
    };
    await poolBd.query('INSERT INTO cliente SET ?', [newLink]);
    req.flash('realizado','Cliente guardado satificactoriamente');
    res.redirect('/links');

});

router.get('/',isLoggedIn, async (req, res) => {
    const links = await poolBd.query('SELECT * FROM cliente');
    res.render('links/list', { links });
});

router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;   
    await poolBd.query('DELETE FROM cliente WHERE ID = ?',[id]);
    req.flash('realizado','Cliente eliminado satificactoriamente');
    res.redirect('/links');      
});

router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await poolBd.query('SELECT * FROM cliente WHERE ID = ?',[id]);
    //console.log(links[0]);
    res.render('links/edit',{link: links[0]});   
    
});

router.post('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { dui, nombre_completo, direccion, telefono } = req.body;
    const editLink = {
        dui,
        nombre_completo,
        direccion,
        telefono
    };
    await poolBd.query('UPDATE cliente SET ? WHERE id = ?',[editLink,id]); 
    req.flash('realizado','Cliente actualizado satificactoriamente');
    res.redirect('/links');
    //console.log('Actualizado Id:',{id});

});


module.exports = router;