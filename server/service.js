const express = require('express');
const path = require('path');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const JSONStream      = require('JSONStream');
const fs = require('fs');
let csv2json = require('csv2json');
// where the data will end up
const outputDBConfig = { dbURL: 'mongodb://127.0.0.1:27017/test', collection: 'productDetails' };
// create the writable stream
const writableStream = streamToMongoDB(outputDBConfig);
// let csvToJson=require('convert-csv-to-json');
let csvjson = require('csvjson');
let multer  = require('multer');
let upload = multer({ dest: 'uploads/' });
let createApp = function() {
  const app = express();
  return app;
};

let setupStaticRoutes = function(app) {
  app.use(express.static(path.join(__dirname, '../', 'client')));
  return app;
};

let setupAppRoutes = function(app) {
//   app.post('/api/upload', upload.single('file'), function(req,res){
//   res.end("File uploaded.");
// });
app.post('/convertToJson',function(req,res){
    var readableStream = fs.createReadStream('./server/input.csv');

var data = "";

var output = [];

readableStream.on('data',function(chunk){
  data += chunk;
})

readableStream.on('end', function() {
  var lines = data.split('\n');

  var parsedData = csvToArray(data);

  var output = [];

  var handle = "";

  var obj = {};

  for(var i=1; i<parsedData.length; i++){

    if(handle == parsedData[i][0]){

      var obj1 = {};
      obj1["color"] = parsedData[i][8];
      obj1["size"] = parsedData[i][10];
      obj1["sku"] = parsedData[i][11];
      obj1["quantity"] = parsedData[i][12];
      obj1["price"] = parsedData[i][13];
      obj1["image"] = parsedData[i][14];

      obj["variants"].push(obj1);

    }
    else{

      if(i!=1){
        output.push(obj);
        obj = {};
      }

      obj["handle"] = parsedData[i][0];
      obj["title"] = parsedData[i][1];
      obj["body"] = parsedData[i][2];
      obj["vendor"] = parsedData[i][3];
      obj["type"] = parsedData[i][4];
      obj["tags"] = parsedData[i][5];
      obj["published"] = parsedData[i][6];
      obj["variants"] = [];

      var obj1 = {};
      obj1["color"] = parsedData[i][8];
      obj1["size"] = parsedData[i][10];
      obj1["sku"] = parsedData[i][11];
      obj1["quantity"] = parsedData[i][12];
      obj1["price"] = parsedData[i][13];
      obj1["image"] = parsedData[i][14];

      obj["variants"].push(obj1);

      handle = parsedData[i][0];

    }

  }

  fs.writeFile('output.json', JSON.stringify(output) , 'utf-8');
  res.send("success");
  })


function csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
  if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret;
};

})

app.get('/productDetails',function(req, res){
  fs.createReadStream('output.json')
      .pipe(JSONStream.parse('*'))
      .pipe(writableStream);
  res.send("success");
});

app.get('/getProductCount', function(req,res){
  let productInfo = require('./models/Product.schema.js');
  productInfo.find().then((doc) => {
        res.json({count:doc.length});
      }, (err) => {
        console.log(err);
        res.send(err);
      });
});
app.get('/getSKU', function(req, res){
  let productInfo = require('./models/Product.schema.js');
    productInfo.findOne({'variants.sku':'\''+req.query.sku}).then((doc)=>{
      if(doc!=null){
      var obj = {};
      obj["title"] = doc.title;
      obj["variants"]=[];
      doc.variants.map(function(item,i){
        if(item.sku == '\''+req.query.sku){
          obj["variants"].push(item);
        }
      })
      res.send(obj);
    }
    else{
      res.send("NA");
    }

    }, (err)=>{
      console.log(err);
      res.send(err);
    });

});

app.post('/getProductDetails', function(req,res){
  let productInfo = require('./models/Product.schema.js');
  productInfo.find().skip((req.body.pageNumber-1)*req.body.pageSize).limit(req.body.pageSize).then((doc) => {
        let output =[];
        doc.forEach(function(element){
          output.push({title:element.title,variants:element.variants})
        })
        res.json(output);
      }, (err) => {
        console.log(err);
        res.send(err);
      });
});


  return app;
};

let saveToDB = function(){
  fs.createReadStream('output.json')
      .pipe(JSONStream.parse('*'))
      .pipe(writableStream);
  console.log('saved to DB');

}

let convertToJSON = function(req,res){
    var readableStream = fs.createReadStream('./server/input.csv');

var data = "";

var output = [];

readableStream.on('data',function(chunk){
  data += chunk;
})

readableStream.on('end', function() {
  var lines = data.split('\n');

  var parsedData = csvToArray(data);

  var output = [];

  var handle = "";

  var obj = {};

  for(var i=1; i<parsedData.length; i++){

    if(handle == parsedData[i][0]){

      var obj1 = {};
      obj1["color"] = parsedData[i][8];
      obj1["size"] = parsedData[i][10];
      obj1["sku"] = parsedData[i][11];
      obj1["quantity"] = parsedData[i][12];
      obj1["price"] = parsedData[i][13];
      obj1["image"] = parsedData[i][14];

      obj["variants"].push(obj1);

    }
    else{

      if(i!=1){
        output.push(obj);
        obj = {};
      }

      obj["handle"] = parsedData[i][0];
      obj["title"] = parsedData[i][1];
      obj["body"] = parsedData[i][2];
      obj["vendor"] = parsedData[i][3];
      obj["type"] = parsedData[i][4];
      obj["tags"] = parsedData[i][5];
      obj["published"] = parsedData[i][6];
      obj["variants"] = [];

      var obj1 = {};
      obj1["color"] = parsedData[i][8];
      obj1["size"] = parsedData[i][10];
      obj1["sku"] = parsedData[i][11];
      obj1["quantity"] = parsedData[i][12];
      obj1["price"] = parsedData[i][13];
      obj1["image"] = parsedData[i][14];

      obj["variants"].push(obj1);

      handle = parsedData[i][0];

    }

  }

  fs.writeFile('output.json', JSON.stringify(output) , 'utf-8',(err)=>{
    if(err)
      console.log("error: ",err);
    else{
      console.log("file wrirted succesfully");
      saveToDB();
    }
  })
  console.log('JSON converted');
  // res.send("success");
  })


function csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
  if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret;
};

}

let setupRESTRoutes = function(app) {
  app.use(function (req, res) {
    let err = new Error('resource not found');
    err.status = 404;
    return res.status(err.status).json({
      error: err.message
    });
  });

  app.use(function (err, req, res) {
    console.error('internal error in watch processor: ', err);
    return res.status(err.status || 500).json({
      error: err.message
    });
  });

  return app;
};

let setupMiddlewares = function(app) {
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  return app;
};

let setupWebpack = function(app) {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config.js');
  const webpackCompiler = webpack(webpackConfig);
  app.use(webpackHotMiddleware(webpackCompiler));
  app.use(webpackDevMiddleware(webpackCompiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      stats: {colors: true}
  }));
  return app;
};

let setupMongooseConnections = function() {
  const mongoose = require('mongoose');
  let mongoURL = 'mongodb://127.0.0.1:27017/test';

  mongoose.connect(mongoURL);

  mongoose.connection.on('connected', function () {
    console.log('mongoose is now connected to ', mongoURL);


    mongoose.connection.on('error', function (err) {
      console.error('error in mongoose connection: ', err);
    });

    mongoose.connection.on('disconnected', function () {
      console.log('mongoose is now disconnected.');
    });

    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log(
          'mongoose disconnected on process termination'
          );
        process.exit(0);
      });
    });
  });
};

module.exports = {
  createApp,
  setupStaticRoutes,
  setupAppRoutes,
  setupRESTRoutes,
  setupMiddlewares,
  setupMongooseConnections,
  setupWebpack,
  convertToJSON,
  saveToDB
};
