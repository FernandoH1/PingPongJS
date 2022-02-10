(function(){
    self.Board = function(width,height){ //Creación de Pizzarron
        this.width = width;              //Creación de atributos del mismo
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    self.Board.prototype = { //Creación de métodos del Pizarron 
        get elements(){
            var elements = this.bars.map(function(bar){return bar;}); //pasa el arreglo de bars como copia para mejor rendimiento
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){
    self.Ball = function(x,y,radius,board){ //Creación de la Pelota
        this.x = x;                         //Creación de atributos de la misma
        this.y = y;
        this.radius = radius;
        this.speed = 3;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        board.ball = this;
        this.kind = "circle";  
    }

    self.Ball.prototype = { //Creación del los métodos de la Pelota
        move: function(){
           this.x += (this.speed_x * this.direction);
           this.y += (this.speed_y);
        },
        get width(){
            return this.radius*2;
        },
        get height(){
            return this.radius*2;
        },
        collision: function(bar){
            //Reacciona a la colisión con una barra que recibe como parámetro
        var relative_intersect_y= ( bar.y + (bar.height / 2) ) -this.y;
        var normalized_intersect_y = relative_intersect_y / (bar.height /2);
        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);

        if(this.x > (this.board.width / 2)) this.direction = -1;
        else this.direction = 1;
        }
    }
})();


(function(){ //Funcion para la creacion de las Barras
    self.Bar= function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 25;
    }

    self.Bar.prototype = { //Creación del los métodos de las Barras
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        }
    }
})();

(function(){ //Creación de la VISTA
    self.BoardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

self.BoardView.prototype = { //Creación de los métodos VISTA
    clean: function(){
        this.ctx.clearRect(0,0,this.board.width,this.board.height);
    },
    draw:function(){ //Dibuja el pizarron con canvas
        for(var i = this.board.elements.length -1; i>= 0; i--){
            var el = this.board.elements[i];
            draw(this.ctx,el);
        };
    },
    ckeck_collisions: function(){
        for(var i = this.board.bars.length -1; i >= 0; i--){
           var bar = this.board.bars[i];
           if(hit(bar, this.board.ball)){
                this.board.ball.collision(bar);
           }
        }
    },
    play: function(){
        if(this.board.playing){
            this.clean();
            this.draw();
            this.ckeck_collisions();
            this.board.ball.move();
        }  
    }
}

function hit(a,b){ //chequea si a colicciona con b(boolean)
    var hit = false;
    //Colisiones horizontales
    if(b.x + b.width >= a.x && b.x < a.x + a.width)
    {
        //Colisiones verticales
        if(b.y +b.height >= a.y && b.y < a.y + a.height)
        hit = true;
    }
    //Colisión de A con B
    if(b.x <= a.x && b.x + b.width >= a.x + a.width)
    {
        if(b.y <= a.y && b.y + b.height >= a.y + a.height){
            hit = true;
        }
    }
    //Colisión de B con A
    if(a.x <= b.x && a.x + a.width >= b.x + b.width)
    {
        if(a.y <= b.y && a.y + a.height >= b.y + b.height){
            hit = true;
        }
    }
    if (b.y <= b.radius ) { //Colisióna en el borde de Arriba
        b.speed_y = 3;
    } else if (b.y >= this.board.height - b.radius) { //Colisióna en el borde de Abajo
        b.speed_y = -3;
    }
    return hit;
}

function draw(ctx,element){ 
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x,element.y,element.width,element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x,element.y,element.radius,0,7);
                ctx.fill();
                ctx.closePath();
                break; 
        }
}
})();

    var board = new Board(1000,600);
    var bar = new Bar(20,180,40,180,board);
    var bar2 = new Bar(940,180,40,180,board);
    var canvas = document.getElementById('canvas',board);
    var board_view = new BoardView(canvas,board);
    var ball = new Ball(500,180,10,board);

document.addEventListener("keydown",function(ev){
    if(ev.keyCode == 38){
        ev.preventDefault();
        bar.up();
    }else if (ev.keyCode == 40){
        ev.preventDefault();
        bar.down();
    }else if(ev.keyCode == 87){ //tecla W
        ev.preventDefault();
        bar2.up();
    }else if(ev.keyCode == 83){ // tecla S
        ev.preventDefault();
        bar2.down();
    }else if(ev.keyCode == 32){ // tecla S
        ev.preventDefault();
        board.playing = !board.playing; // Pone una Pausa con la Barra Espaciadora
    }
});

window.requestAnimationFrame(controller);
board_view.draw();

setTimeout(function(){
    ball.direction = -1;
},4000);

function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
}