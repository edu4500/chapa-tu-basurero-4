var express = require('express');
var router = express.Router();

//var crudCtrl = require('../controllers/crud');
var iot = require('../controllers/iot');

//iot nuevo dispositivos iot
router.post( '/iot' ,iot.CrearUbicacion );

//iot actualizar dispositivos iot
router.post('/iot/:iotid' ,iot.ActualizarUbicacion );

router.get('/iot2/:iotid/nuevo/:tipo/:estado/:lon/:lat', iot.RegistrarIot);
router.get('/iot2/:iotid/estado/ubicacion/:estado/:lon/:lat', iot.ActualizarEstadoUbicacion);
router.get('/iot2/:iotid/estado/:estado', iot.ActualizarEstado);
router.get('/iot2/:iotid/ubicacion/:lon/:lat', iot.ActualizarUbicacion2);

/*
router.get('/iot2/:iotid/camion/:estado', iot.ActualizarUbicacion2);
router.get('/iot2/:iotid/coor/basurero/:lon/:lat', iot.ActualizarUbicacion2);
router.get('/iot2/:iotid/coor/camion/:lon/:lat', iot.ActualizarUbicacion2); */

//consultar disostivos iot
router.get( '/iot',iot.getTodos );
router.get('/iot2', iot.getTodos2);
router.get('/iot/basurero', iot.getBasurero);
router.get('/iot/camion', iot.getCamion);


module.exports = router;
