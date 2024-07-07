var c = document.getElementById("myCanvas");
var c2 = document.getElementById("myCanvas2");
var cWidth = parseInt(c.getAttribute("width"));
c.setAttribute("height",cWidth);
c2.setAttribute("height",cWidth);
var gameW = cWidth;
var gameH = cWidth;

var ctx = c.getContext("2d");
var ctx2 = c2.getContext("2d");
ctx.fillStyle = "#aaa";
ctx.fillRect(0, 0, gameW,gameH);

function setcLeft(){
    $(c).css("left",($("#canvasDiv").outerWidth()-$(c).outerWidth())/2);
    $(c2).css("left",($("#canvasDiv").outerWidth()-$(c2).outerWidth())/2);
}
window.onresize = ()=>{setcLeft()};
window.onload = ()=>{setcLeft()};

var numOfRed = 6;
var numOfRows = (numOfRed*2)+1;
var squareSide = gameW/numOfRows;
var lastx = gameW-squareSide;
var lasty = gameH-squareSide;
var img = document.getElementById("rock");

function actKey(keyDoer,key){
    switch(key){
        case 68:
            keyDoer.goright();
            break;
        case 65:
            keyDoer.goleft();
            break;
        case 87:
            keyDoer.goup();
            break;
        case 83:
            keyDoer.godown();
            break;
        case 70:
            keyDoer.place();
            break;
    }
}

function keyPressed(event){
    if(document.activeElement.id != 'messageArea'){
        socket.emit('keyPress',{Number:playerNum,key:event.which});
    }
    else if(event.which == 13){
        sendText();
    }
}

function sendText(){
    socket.emit('newMes',{Message:document.getElementById("messageArea").value,color:thisplayer.color});
    document.getElementById("messageArea").value = "";
}

var half = squareSide/2;
var quater = squareSide/4;
var Bimg = document.getElementById("bombCartoon");
var Eimg = document.getElementById("explosion");
var numImg = document.getElementById("num");
var powerImg = document.getElementById("power");
var colorNum;
var expPos = []
var bPos = new Object();
var players = [];
class bomb{
    constructor(player,posx,posy,power) {
        this.player = player;
        this.bposx = posx;
        this.bposy = posy;
        this.power = power;
        this.blown = false;
    }
    explode(posx,posy){
        let x = posx.toFixed(2);
        let y = posy.toFixed(2);
        players.forEach(el => {
            if(el.alive && el.posx.toFixed(2) == x && el.posy.toFixed(2) == y){
                el.lost();
            }
        });
        let arrString = [x,y].toString();
        Object.keys(bPos).forEach(el => {
            let arr = el.split(",");
            if(parseFloat(arr[0]).toFixed(2) == x && parseFloat(arr[1]).toFixed(2) == y){
                bPos[el].blown = true;
                bPos[el].blow();
            }
        });
        expPos.push(arrString);
        ctx2.drawImage(Eimg,x,y,squareSide,squareSide);
        setTimeout(()=>{
            expPos.splice(expPos.indexOf(arrString),1);
            if(expPos.indexOf(arrString) == -1){
                ctx2.clearRect(x, y, squareSide, squareSide);
            }
            if(powerPos.indexOf(arrString)!=-1){
                powerPos.splice(powerPos.indexOf(arrString),1);
                ctx.drawImage(powerImg,x,y,squareSide,squareSide);
            }
            else if(numPos.indexOf(arrString)!=-1){
                numPos.splice(numPos.indexOf(arrString),1);
                ctx.drawImage(numImg,x,y,squareSide,squareSide);
            }
        },1000);
    }
    prepare(){
        setTimeout(()=>{
            if(!this.blown){
                this.blow();
            }
        },3000);
    }
    blow(){
        delete bPos[[this.bposx,this.bposy].toString()];
        ctx2.clearRect(this.bposx, this.bposy, squareSide, squareSide);
        ctx.fillStyle = "#aaa";
        ctx.fillRect(this.bposx, this.bposy, squareSide,squareSide);
        this.explode(this.bposx, this.bposy);
        this.player.numOfPlaced -= 1;

        var num;
        var mul;

        //up
        for(num = 1;num<=this.power;num++){
            mul = squareSide*num;
            colorNum = ctx.getImageData(this.bposx+half, this.bposy-mul+half, 1, 1).data;
            if(!(colorNum[0] == 150&&colorNum[1] == 0&&colorNum[2] == 0) && this.bposy>=mul){
                ctx.fillStyle = "#aaa";
                ctx.clearRect(this.bposx, this.bposy-mul, squareSide,squareSide);
                ctx.fillRect(this.bposx, this.bposy-mul, squareSide,squareSide);
                this.explode(this.bposx, this.bposy-mul);
            }
            if(!(colorNum[0] == 170&& colorNum[1] == 170&&colorNum[2] == 170)){
                break;
            }
        }

        //down
        for(num = 1;num<=this.power;num++){
            mul = squareSide*num;
            colorNum = ctx.getImageData(this.bposx+half, this.bposy+mul+half, 1, 1).data;
            if(!(colorNum[0] == 150&&colorNum[1] == 0&&colorNum[2] == 0)){
                ctx.fillStyle = "#aaa";
                ctx.clearRect(this.bposx, this.bposy+mul, squareSide, squareSide);
                ctx.fillRect(this.bposx, this.bposy+mul, squareSide, squareSide);
                this.explode(this.bposx, this.bposy+mul);
            }
            if(!(colorNum[0] == 170&& colorNum[1] == 170&&colorNum[2] == 170)){
                break;
            }
        }
        //left
        for(num = 1;num<=this.power;num++){
            mul = squareSide*num;
            colorNum = ctx.getImageData(this.bposx-mul+half, this.bposy+half, 1, 1).data;
            if(!(colorNum[0] == 150&&colorNum[1] == 0&&colorNum[2] == 0) && this.bposx>=mul){
                ctx.fillStyle = "#aaa";
                ctx.clearRect(this.bposx-mul, this.bposy, squareSide,squareSide);
                ctx.fillRect(this.bposx-mul, this.bposy, squareSide,squareSide);
                this.explode(this.bposx-mul, this.bposy);
            }
            if(!(colorNum[0] == 170&& colorNum[1] == 170&&colorNum[2] == 170)){
                break;
            }
        }
        //right
        for(num = 1;num<=this.power;num++){
            mul = squareSide*num;
            colorNum = ctx.getImageData(this.bposx+mul+half, this.bposy+half, 1, 1).data;
            if(!(colorNum[0] == 150&&colorNum[1] == 0&&colorNum[2] == 0)){
                ctx.fillStyle = "#aaa";
                ctx.clearRect(this.bposx+mul, this.bposy, squareSide,squareSide);
                ctx.fillRect(this.bposx+mul, this.bposy, squareSide,squareSide);
                this.explode(this.bposx+mul, this.bposy);
            }
            if(!(colorNum[0] == 170&& colorNum[1] == 170&&colorNum[2] == 170)){
                break;
            }
        }
    }
}

class Player{
    constructor(color, posx, posy) {
        this.color = color;
        this.posx = posx;
        this.posy = posy;
        this.numOfPlaced = 0;
        this.maxPlaced = 1;
        this.power = 1;
        this.alive = false;
    }
    getColor(){
        return ctx.getImageData(this.posx+half, this.posy+half, 1, 1).data;
    }
    setStartPos(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
    }
    goup(){
        let checkColor = ctx.getImageData(this.posx+quater, this.posy-half-quater, 1, 1).data[0];
        if([170,146,197].includes(checkColor)){
            if(checkColor==146){
                this.maxPlaced += 1;
            }
            else if(checkColor == 197){
                this.power += 1
            }
            let nextColor = ctx2.getImageData(this.posx+half, this.posy-half, 1, 1).data[0];
            if(nextColor == 0){
                ctx.fillStyle = "#aaa";
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
                this.posy -= squareSide;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
            }
            else if(nextColor == 250){
                ctx.fillStyle = "#aaa";
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
                this.posy -= squareSide;
                this.lost();
            }
        }
    }
    godown(){
        let checkColor = ctx.getImageData(this.posx+quater, this.posy+(squareSide*1.2), 1, 1).data[0];
        if([170,146,197].includes(checkColor)){
            if(checkColor==146){
                this.maxPlaced += 1;
            }
            else if(checkColor == 197){
                this.power += 1
            }
            let nextColor = ctx2.getImageData(this.posx+half, this.posy+(squareSide*1.5), 1, 1).data[0];
            if(nextColor == 0){
                ctx.fillStyle = "#aaa";
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
                this.posy += squareSide;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
            }
            else if(nextColor == 250){
                ctx.fillStyle = "#aaa";
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
                this.posy += squareSide;
                this.lost();
            }
        }
    }
    goleft(){
        let checkColor = ctx.getImageData(this.posx-half-quater, this.posy+quater, 1, 1).data[0];
        if([170,146,197].includes(checkColor)){
            if(checkColor==146){
                this.maxPlaced += 1;
            }
            else if(checkColor == 197){
                this.power += 1
            }
            let nextColor = ctx2.getImageData(this.posx-half, this.posy+half, 1, 1).data[0];
            if(nextColor == 0){
                ctx.fillStyle = "#aaa";
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
                this.posx -= squareSide;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
            }
            else if(nextColor == 250){
                ctx.fillStyle = "#aaa";
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
                this.posx -= squareSide;
                this.lost();
            }
        }
    }
    goright(){
        let checkColor = ctx.getImageData(this.posx+(squareSide*1.2), this.posy+quater, 1, 1).data[0];
        if([170,146,197].includes(checkColor)){
            if(checkColor==146){
                this.maxPlaced += 1;
            }
            else if(checkColor == 197){
                this.power += 1
            }
            let nextColor = ctx2.getImageData(this.posx+(squareSide*1.5), this.posy+half, 1, 1).data[0];
            if(nextColor == 0){
                ctx.fillStyle = "#aaa";
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
                this.posx += squareSide;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
            }
            else if(nextColor == 250){
                ctx.fillStyle = "#aaa";
                ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
                this.posx += squareSide;
                this.lost();
            }
        }
    }
    place(){
        if(this.numOfPlaced < this.maxPlaced){
            if(ctx2.getImageData(this.posx+half, this.posy+half, 1, 1).data.reduce((total,cur)=>total+cur,0)==0){
                ctx2.drawImage(Bimg,this.posx,this.posy,squareSide,squareSide);
                let newB = new bomb(this,this.posx,this.posy,this.power);
                bPos[[this.posx,this.posy].toString()] = newB;
                this.numOfPlaced += 1;
                newB.prepare();
            }
        }
    }
    lost(){
        $(document.body).off();
        this.alive = false;
        ctx.fillStyle = "#555";
        ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
        let counter = 0;
        let counter2 = -1;
        let winPos;
        let winner;
        players.forEach(el => {
            counter2 += 1;
            if(el.alive){
                counter += 1;
                winner = el;
                winPos = counter2;
            };
        });
        setTimeout(()=>{
            if(counter == 1 && winPos == playerNum-1){
                $(document.body).off();
                socket.emit('announce winner',playerNum-1);
            }
        },500);
        setTimeout(()=>{
            ctx.fillStyle = "#aaa";
            ctx.fillRect(this.posx, this.posy, squareSide,squareSide);
        },2000);
    }
}

var tempPlayerObj;
function getPlayer(color,x,y){
    tempPlayerObj = new Player(color,x,y);
    players.push(tempPlayerObj);
    return tempPlayerObj;
}