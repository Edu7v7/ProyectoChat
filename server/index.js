//Estamos importando el esquema definido que esta en el archivo chat.js
var Chat = require('../models/chat.js');

var express = require("express");

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//Almacenamos a la biblioteca mongoose en una variable 
var mongoose = require('mongoose');
const { text } = require('express');

// db connection
mongoose.connect('mongodb://localhost/chat-database').then(db => console.log('bd conectada')).catch(err => console.log('err'));



app.use(express.static('client'));

//ruta para ver que funciona el servidor y muestra el mensaque que querramos 
app.get('/hola-mundo', function(req, res){
    res.status(200).send("Hola mundo desde una ruta");
});

var messages = [{
    id: 1,
    text: 'Bienvenido al chat privado de socket.io y NodeJS de Eduardo...',
    nickname:'Bot - EduardoQuispe'
}];

io.on('connection', async function(socket){
    console.log("El cliente con IP: "+socket.handshake.address+"se ha conectado...");
   //Cargando los mensajes de la bd
    var messagess = await Chat.find({});
    socket.emit('Carga los viejos mensajes');
    
    socket.emit('messages', messages);

    socket.on('add-message', async function(data){
        messages.push(data);

        var newMsg = new Chat({
            msg: messages,
            nick: socket.nickname
        });
        await newMsg.save();

        //io.sockets.emit('messages', messages);
        io.sockets.emit('messages', {
            msg: data,
            nick:socket.nickname
        });

    });
});

server.listen(6677, function(){
    console.log("Servidor esta funcionando en http://localhost:6677");
});