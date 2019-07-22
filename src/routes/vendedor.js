const express = require('express');
const router = express.Router();
const poolBd = require('../database');
const helpers = require('../lib/helpers');

const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, async (req, res) => {
    const vendedor_acceso = await poolBd.query('SELECT * FROM vendedor LEFT JOIN acceso ON acceso_id = acceso.id_acceso');
    res.render('vendedor/list', { vendedor_acceso });
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { dui, nombre_completo, direccion, telefono, email, credencial } = req.body;
    const nuevoAcceso = {
        email,
        credencial
    };
    const verificacion_acceso = await poolBd.query('SELECT * FROM acceso WHERE email = ?', [email]);
    const verificacion_vendedor = await poolBd.query('SELECT * FROM vendedor WHERE dui = ?', [dui]);

    if (verificacion_acceso[0]) {
        req.flash('importante', 'Ya existe! email suministrado');
        res.redirect('/vendedor');

    } if(verificacion_vendedor[0]){
        req.flash('importante', 'Ya existe! identificacion sumunistrada');
        res.redirect('/vendedor');
    }
    else {
        nuevoAcceso.credencial = await helpers.cifrarCredencial(credencial);
        await poolBd.query('INSERT INTO acceso SET ?', [nuevoAcceso]);
        const filas = await poolBd.query('SELECT * FROM acceso ORDER BY id_acceso DESC LIMIT 1');
        const acceso_id = filas[0].id_acceso;
        const nuevoVendedor = {
            dui,
            nombre_completo,
            direccion,
            telefono,
            acceso_id
        };
        await poolBd.query('INSERT INTO vendedor SET ?', [nuevoVendedor]);
        req.flash('realizado', 'Vendedor guardado satificactoriamente');
        res.redirect('/vendedor');
    }
});

router.post('/delete', isLoggedIn, async (req, res) => {
    const filas = await poolBd.query('SELECT * FROM vendedor WHERE id_vendedor = ?', [req.body.id_vendedor]);
    const id_vendedor = req.body.id_vendedor;
    const id_acceso = filas[0].acceso_id;
    if (filas[0].nombre_completo === 'admin') {
        req.flash('importante', 'Importante no se puede borrar Admin');
        res.redirect('/vendedor');
    }
    if (req.user.id_acceso == id_acceso) {
        req.flash('importante', 'Importante no se puede borrar Usuario en Session');
        res.redirect('/vendedor');
    }
    else {
        await poolBd.query('DELETE FROM vendedor WHERE id_vendedor = ?', [id_vendedor]);
        await poolBd.query('DELETE FROM acceso WHERE id_acceso = ?', [id_acceso]);
        req.flash('realizado', 'Vendedor eliminado satificactoriamente');
        req.flash('importante', 'Importante Acceso al sistema eliminado adicionalmente');
        res.redirect('/vendedor');
    }


});

/*router.get('/delete/:id_vendedor', isLoggedIn, async (req, res) => {
    const { id_vendedor } = req.params;
    const filas = await poolBd.query('SELECT * FROM vendedor WHERE id_vendedor = ?', [id_vendedor]);
    const resultado = filas[0];
    const id_acceso = resultado.acceso_id;
    const validar_admin = resultado.nombre_completo;

    console.log(req.user.id_acceso);
    console.log(id_acceso);

    if (validar_admin === 'admin') {
        req.flash('importante', 'Importante no se puede borrar Admin');
        res.redirect('/vendedor');
    }
    if (req.user.id = id_acceso) {
        req.flash('importante', 'Importante no se puede borrar Usuario en Session');
        res.redirect('/vendedor');
    } else {
        await poolBd.query('DELETE FROM vendedor WHERE id_vendedor = ?', [id_vendedor]);
        await poolBd.query('DELETE FROM acceso WHERE id_acceso = ?', [id_acceso]);
        req.flash('realizado', 'Vendedor eliminado satificactoriamente');
        req.flash('importante', 'Importante Acceso al sistema eliminado adicionalmente');
        res.redirect('/vendedor');
    }
});*/


/*router.get('/add', isLoggedIn, (req, res) => {
    res.render('vendedor/add');
});*/



module.exports = router;