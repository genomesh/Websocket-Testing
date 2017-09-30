'use strict';
var bodyParser = require('body-parser');
var express  = require('express');
var app = express();
var path = require('path');
var socket = require('socket.io');

var squares = [];

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3000));
var server = app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port'))
})

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    socket.pos;
    console.log("New connection: " + socket.id);
    io.emit('nc', socket.id)
    squares.push(new Squ(socket.id))
    socket.on('update', function(msg){
        socket.pos = msg;
        for (let i=0;i<squares.length;i++) {
            if (squares[i].id == socket.id) {
                squares[i].pos = msg;
            }
        }
        //console.log('Update: ' + socket.pos);
        //io.emit('update', JSON.stringify([socket.id, msg]))
        io.emit('update', JSON.stringify(squares));
    });
    socket.on('disconnect', function() {
        console.log('User DC: ' + socket.id);
        for (let i=0;i<squares.length;i++) {
            if (squares[i].id == socket.id) {
                squares.splice(i,1);
                i -= 1;
            }
        }
    })
}

function Squ (id) {
    this.pos = [5,5];
    this.id = id;
}