(function(){
    var self.Board =function(width,heigth){
        this.width = width;
        this.heigth = heigth;
        this.playing = false;
        this.game_over = false;
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars;
            elements.push(ball);
            return elements;
        }
    }
})();

(function(){
    self.BoardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.heigth = board.heigth;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }
})();

window.addEventListener("load",main);

function main(){
    var board = new Board(800,400);
    var canvas = document.getElementById('canvas',board);
    var board_view = new BoardView();



}