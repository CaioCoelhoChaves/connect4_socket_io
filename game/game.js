class Game{

    constructor(id, player, io){
        this.id = id; //nome da sala
        this.status = "waiting"; //waiting, playing, finished
        this.io = io;
        this.players = [];
        this.players.push(player);
        this.tilesList = [42];
        this.playerTurn = player;
        this.theWinner = "none";
        for(let i = 0; i < 42; i++){
            this.tilesList[i] = "white";
        }
        io.sockets.in(id).emit('status', this.status);
        io.sockets.in(id).emit('tiles', JSON.stringify(this.tilesList));
        this.addPlayer = this.addPlayer;
        this.newPlay = this.newPlay;

    }

    addPlayer(player, socket){
        if(this.players.length < 2){
            this.players.push(player);
            if(this.players.length == 2){
                this.status = "playing";
                this.io.sockets.in(this.id).emit('status', this.status);
            }
        } else if(this.players.length == 2){
            socket.emit('error', 'Sala cheia!');
        } 
    }

    newPlay(player, column, socket){
        console.log(this.theWinner);
        if(this.playerTurn == player && this.theWinner == "none"){ 
            if(player == this.players[0]){ //JOGADOR VERMELHO
                this.play(column, "red");
                this.playerTurn = this.players[1]//Muda a vez de jogar
            } else{ //JOGADOR AZUL
                this.play(column, "blue");
                this.playerTurn = this.players[0]//Muda a vez de jogar
            }
            this.testWinner();
            //Mandar as informações basicas do jogo para os players*
            this.io.sockets.in(this.id).emit('turn', this.playerTurn);
            this.io.sockets.in(this.id).emit('tiles', JSON.stringify(this.tilesList));
            this.io.sockets.in(this.id).emit('status', this.status);
        } else if(this.theWinner != "none"){
            socket.emit('theWinner', this.theWinner);
        }else{
            socket.emit('error', 'Não é a sua vez!');
        }
    }

    play(column, color){
        if(this.tilesList[column + 35] == "white"){
            this.tilesList[column + 35] = color;
        } else if(this.tilesList[column + 28] == "white"){
            this.tilesList[column + 28] = color;
        } else if(this.tilesList[column + 21] == "white"){
            this.tilesList[column + 21] = color;
        } else if(this.tilesList[column + 14] == "white"){
            this.tilesList[column + 14] = color;
        } else if(this.tilesList[column + 7] == "white"){
            this.tilesList[column + 7] = color;
        } else if(this.tilesList[column] == "white"){
            this.tilesList[column] = color;
        }
    }

    testWinner(){

        //TESTE HORIZONTAIS
        for(let l = 0; l <= 35; l+=7){  
            for(let c = 0; c <= 6; c++){
                if(this.tilesList[l+c] == this.tilesList[l+(c+1)] 
                && this.tilesList[l+c] == this.tilesList[l+(c+2)]
                && this.tilesList[l+c] == this.tilesList[l+(c+3)]
                && this.tilesList[l+c] != "white"){
                    console.log("VENCEDOR: " + this.tilesList[l+c]);
                    this.theWinner = this.tilesList[l+c];
                }
            }
        }

        //TESTES VERTICAIS
        for(let c = 0; c <= 6; c++){  
            for(let l = 0; l <= 35; l+=7){
                if(this.tilesList[c+l] == this.tilesList[c+(l+7)] 
                && this.tilesList[c+l] == this.tilesList[c+(l+14)]
                && this.tilesList[c+l] == this.tilesList[c+(l+21)]
                && this.tilesList[c+l] != "white"){
                    console.log("VENCEDOR: " + this.tilesList[l+c]);
                    this.theWinner = this.tilesList[l+c];
                }
            }
        }

        //TESTES DIAGONAIS 1
        for(let u = 0; u <= 17; u++){
            if( (u >= 0 && u <= 3) || (u >= 7 && u <= 10) || (u >= 14 && u <= 17) ){
                if(this.tilesList[u] == this.tilesList[u+8] 
                && this.tilesList[u] == this.tilesList[u+16]
                && this.tilesList[u] == this.tilesList[u+24]
                && this.tilesList[u] != "white"){
                    console.log("VENCEDOR: " + this.tilesList[u]);
                    this.theWinner = this.tilesList[u];
                }
            }
        }

        //TESTES DIAGONAIS 2
        for(let u = 20; u >= 3; u--){
            if( (u <= 6 && u >= 3) || (u <= 13 && u >= 10) || (u <= 20 && u >= 17) ){
                if(this.tilesList[u] == this.tilesList[u+6] 
                && this.tilesList[u] == this.tilesList[u+12]
                && this.tilesList[u] == this.tilesList[u+18]
                && this.tilesList[u] != "white"){
                    console.log("VENCEDOR: " + this.tilesList[u]);
                    this.theWinner = this.tilesList[u];
                }
            }
        }

    }
    /* CONNECT 4 TILES
    00 01 02 03 04 05 06
    07 08 09 10 11 12 13
    14 15 16 17 18 19 20
    21 22 23 24 25 26 27 
    28 29 30 31 32 33 34
    35 36 37 38 39 40 41
    */



}

module.exports = Game;