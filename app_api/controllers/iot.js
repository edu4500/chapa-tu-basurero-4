var mongoose = require('mongoose');
var iot = mongoose.model('iot');

var CAMION = 0;
var BASURERO = 1;

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var getQueryGeo = function (lon,lat,distance,tipo) {
  var query_geoNear = {
    loc: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lon, lat]
        },
        $maxDistance: distance
      }
    }
  }
  if(tipo != undefined){
    query_geoNear.tipo = tipo;
  }
  return query_geoNear;
};


module.exports.getTodos = function(req,res){
  var lon = parseFloat(req.query.lon);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance||200);

  if ((!lon && lon !== 0) || (!lat && lat !== 0) || !maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJsonResponse(res, 404, {
      "message": "lon, lat and maxDistance query parametros son requiridos"
    });
    return;
  }

  iot.find(getQueryGeo(lon, lat, maxDistance), function (err, iot) {
    if(err){sendJsonResponse(res,400,err);}
    else{
      var iots_parse = [];
      iot.map(e=> {
        iots_parse.push(e.parseSendRest())
      })
      sendJsonResponse(res, 200, iots_parse);
    }
  });
}

module.exports.getTodos2 = function (req, res) {
  iot.find(function (err, iot) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      var iots_parse = [];
      iot.map(e => {
        iots_parse.push(e.parseSendRest())
      })
      sendJsonResponse(res, 200, iots_parse);
    }
  });
}


module.exports.getCamion = function(req,res){
  var lon = parseFloat(req.query.lon);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance || 200);

  if ((!lon && lon !== 0) || (!lat && lat !== 0) || !maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJsonResponse(res, 404, {
      "message": "lon, lat and maxDistance query parametros son requiridos"
    });
    return;
  }

  iot.find(getQueryGeo(lon, lat, maxDistance, CAMION), function (err, iot) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      var iots_parse = [];
      iot.map(e => {
        iots_parse.push(e.parseSendRest())
      })
      sendJsonResponse(res, 200, iots_parse);
    }
  });
}

module.exports.getBasurero = function(req,res){
  var lon = parseFloat(req.query.lon);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance || 200);

  if ((!lon && lon !== 0) || (!lat && lat !== 0) || !maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJsonResponse(res, 404, {
      "message": "lon, lat and maxDistance query parametros son requiridos"
    });
    return;
  }

  iot.find(getQueryGeo(lon, lat, maxDistance, BASURERO), function (err, iot) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      var iots_parse = [];
      iot.map(e => {
        iots_parse.push(e.parseSendRest())
      })
      sendJsonResponse(res, 200, iots_parse);
    }
  });
}

module.exports.CrearUbicacion = function(req,res){
  if(req.body._id!=null&&req.body._id!=undefined){
    sendJsonResponse(res,400,{msg:"no campo no permitido"});
  }
  else{
    var nuevoDato = new iot({
      id: req.body.id,
      tipo: req.body.tipo,
      estado: req.body.estado,
      loc: {
        type: "Point",
        coordinates: [req.body.lon, req.body.lat]
      }
    });
    nuevoDato.save(err=>{
      if(err) {sendJsonResponse(res,400,err)}
      else {
        sendJsonResponse(res, 200, nuevoDato.parseSendRest());
      }
    })
  }
}

module.exports.ActualizarUbicacion = function(req,res){
  var iotid = req.params.iotid;
  iot.findOne({
    id: iotid
  }, function (err, iot_res) {
      if (err) {
        sendJsonResponse(res, 400, err)
      } else {
        if(iot_res){
          iot_res.tipo = req.body.tipo||iot_res.tipo;
          iot_res.estado = req.body.estado||iot_res.estado;
          iot_res.loc.coordinates = [req.body.lon||iot_res.lon, req.body.lat||iot_res.lat];
          iot_res.save(err => {
            if (err) {
              sendJsonResponse(res, 400, err)
            } else {
              sendJsonResponse(res, 200, iot_res.parseSendRest());
            }
          })
        }
        else{
          var nuevoDato = new iot({
            id: iotid,
            tipo: req.body.tipo,
            estado: req.body.estado,
            loc: {
              type: "Point",
              coordinates: [req.body.lon, req.body.lat]
            }
          });
          nuevoDato.save(err => {
            if (err) {
              sendJsonResponse(res, 400, err)
            } else {
              sendJsonResponse(res, 200, nuevoDato.parseSendRest());
            }
          })
        }
      }
  });
}

module.exports.RegistrarIot = function (req, res) {
  var iotid = req.params.iotid;
  var iot_tipo = req.params.tipo;
  var iot_estado = req.params.estado;
  var iot_lon = req.params.lon;
  var iot_lat = req.params.lat;

  var nuevoDato = new iot({
    id: iotid,
    tipo: iot_tipo,
    estado: iot_estado,
    loc: {
      type: "Point",
      coordinates: [iot_lon, iot_lat]
    }
  });
  nuevoDato.save(err => {
    if (err) {res.status(400).send("err");} 
    else {res.status(200).send("ok");}
  });
};


module.exports.ActualizarEstadoUbicacion = function (req, res) {
  var iotid = req.params.iotid;
  var iot_estado = req.params.estado;
  var iot_lon = req.params.lon;
  var iot_lat = req.params.lat;

  iot.findOne({
    id: iotid
  }, function (err, iot_res) {
    if (err) {
      res.status(400).send("err");
    } else {
      if (!iot_res) {
        res.status(400).send("err");
      } else {
        iot_res.estado = iot_estado;
        iot_res.loc.coordinates = [iot_lon, iot_lat];
        iot_res.save(err => {
          if (err) {res.status(400).send("err");} 
          else {res.status(200).send("ok");}
        });
      }
    }
  });
};

module.exports.ActualizarEstado = function (req, res) {
  var iotid = req.params.iotid;
  var iot_estado = req.params.estado;

  iot.findOne({
    id: iotid
  }, function (err, iot_res) {
    if (err) {
      res.status(400).send("err");
    } else {
      if (!iot_res) {
        res.status(400).send("err");
      } else {
        iot_res.estado = iot_estado;
        iot_res.save(err => {
          if (err) {res.status(400).send("err");}
          else {res.status(200).send("ok");}
        });
      }
    }
  });
};

module.exports.ActualizarUbicacion2 = function (req, res) {
  var iotid = req.params.iotid;
  var iot_lon = req.params.lon;
  var iot_lat = req.params.lat;

  iot.findOne({
    id: iotid
  }, function (err, iot_res) {
    if (err) {
      res.status(400).send("err");
    } else {
      if (!iot_res){
        res.status(400).send("err");
      }
      else{
        iot_res.loc.coordinates = [iot_lon, iot_lat];
        iot_res.save(err => {
          if (err) {res.status(400).send("err");}
          else {res.status(200).send("ok");}
        });
      }
    }
  });
};