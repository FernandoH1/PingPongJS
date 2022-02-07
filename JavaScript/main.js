(function(){
    self.Board = function(width,height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars;
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){ //Funcion para la creacion de las barras
    self.Bar= function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "x: "+ this.x +" y: "+this.y ;
        }
    }
})();

(function(){
    self.BoardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

self.BoardView.prototype = {
    draw:function(){
        for(var i = this.board.elements.length -1; i>= 0; i--){
            var el = this.board.elements[i];
            draw(this.ctx,el);
        };
    }
}

function draw(ctx,element){
    if(element !== null && element.hasOwnProperty("kind")){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x,element.y,element.width,element.height);
            break;
        }
    }
}
})();

    var board = new Board(1000,600);
    var bar = new Bar(20,180,40,180,board);
    var bar2 = new Bar(940,180,40,180,board);
    var canvas = document.getElementById('canvas',board);
    var board_view = new BoardView(canvas,board);

document.addEventListener("keydown",function(ev){
    if(ev.keyCode == 38){
        bar.up();
    }else if (ev.keyCode = 40){
        bar.down();
    }
});

self.addEventListener("load",main);

function main(){
    console.log(board);
    board_view.draw();
}