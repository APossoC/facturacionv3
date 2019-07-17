const mysql = require ('mysql'); 
const {promisify}= require('util');
const {database} = require ('./keys');
const pool = mysql.createPool(database);

pool.getConnection((err,connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('CONEXION CON BD CERRADA');
        }
        if(err.code === 'ER_CONB_COUNT_ERROR'){
            console.error('BD TIENE MUCHAS CONEXIONES');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('CONEXION CON BD RECHAZADA');
        }
    }else if(connection !== null){
         connection.release();
         console.log('BD CONECTADA');
         return;
        }
    
    
});
//Promisify Pool Query
pool.query = promisify(pool.query);

module.exports = pool;