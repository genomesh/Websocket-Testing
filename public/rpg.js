var canvas, ctx, socket, bSqu, keysDown, queue, otherSquares, found, squares, sxy, r, squareSize;

function init() {
    socket = io();
    squares = [];
    sxy = [];
    squareSize = 25;
    socket.io.connect('http://localhost:3000');
    socket.on('update', function(msg) {
        sxy = [];
        r = JSON.parse(msg);
        for (let x = 0; x<r.length; x++) {
            if (typeof r[x].pos == 'string') {sxy.push(JSON.parse(r[x].pos))};
        }
    });
    canvas = document.createElement('canvas');
    canvas.height = 500;
    canvas.width = 800;
    bSqu = new sSqu();
    ctx = canvas.getContext('2d');
    document.getElementById('gameArea').insertBefore(canvas, document.getElementById('gameArea').childNodes[0]);
    console.log('setup complete');
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    window.setInterval(updateCanvas,25);
    window.addEventListener('keydown', function (e) {
        canvas.keys = (canvas.keys || []);
        canvas.keys[e.keyCode] = true;
        if(e.keyCode==65) {bSqu.v[0] = -bSqu.m}
        if(e.keyCode==68) {bSqu.v[0] = bSqu.m}
        if(e.keyCode==87) {bSqu.v[1] = -bSqu.m}
        if(e.keyCode==83) {bSqu.v[1] = bSqu.m}
    })
    window.addEventListener('keyup', function (e) {
        canvas.keys[e.keyCode] = false;
        if(e.keyCode==65) { if(canvas.keys[68]) {bSqu.v[0] = bSqu.m} else {bSqu.v[0] = 0}}
        if(e.keyCode==68) { if(canvas.keys[65]) {bSqu.v[0] = -bSqu.m} else {bSqu.v[0] = 0}}
        if(e.keyCode==87) { if(canvas.keys[83]) {bSqu.v[1] = bSqu.m} else {bSqu.v[1] = 0}}
        if(e.keyCode==83) { if(canvas.keys[87]) {bSqu.v[1] = -bSqu.m} else {bSqu.v[1] = 0}}
    })
}

function updateCanvas () {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let b = 0; b<sxy.length;b++) {
        drawSqu(sxy[b][0],sxy[b][1],squareSize);
    }
    bSqu.update();
}

function sSqu () {
    this.pos = [5,5];
    this.s = squareSize;
    this.m = 5;
    this.v = [0,0];
    this.update = function () {
        for (var i = 0; i<2;i++) {
            this.pos[i] += this.v[i];
            if (this.pos[i] < 5) {this.pos[i] = 5}
        }
        if (this.pos[0] > canvas.width - this.s - 5) {this.pos[0] = canvas.width - this.s - 5};
        if (this.pos[1] > canvas.height -this.s - 5) {this.pos[1] = canvas.height - this.s -5}
        socket.emit('update', JSON.stringify(this.pos));
    };
}

function drawSqu (x,y,h) {
    ctx.fillStyle = 'purple';
    ctx.fillRect(x,y,h,h);
}