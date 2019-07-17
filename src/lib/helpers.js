const bcrypts = require('bcryptjs');
const helpers = {};

helpers.cifrarCredencial = async (credencial) => {
    //const salt = await bcrypts.genSalt(10);
    const hash = await bcrypts.hash(credencial, 10);
    console.log(hash);
    return hash;
};

helpers.compararCredencial = async (credencial, credencialGuardada) => {
    const verificar = await bcrypts.compare(credencial, credencialGuardada);
    try {
        return verificar;
    } catch (e) {
        console.log(e);
    }
};

module.exports = helpers;