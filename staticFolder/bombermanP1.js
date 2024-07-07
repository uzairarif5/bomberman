var maxTemp = 2;
function numOptions(event){
    $('.numOptions').css("background-color",'#999');
    $(event.target).css("background-color",'#0c0');
    maxTemp = parseInt($(event.target).text());
}

function startgame(){
    $('#startGameInner').css({"border-style":'ridge','cursor':'default'});
    $('#startGameInner').text("loading...");
    $("#startInner").hide(400);
    setTimeout(()=>{$("#waiting").show(400)},500);
    socket.emit('setMax', maxTemp);
}

var rockPos = [];
var numPos = [];
var powerPos = [];
var i;
var j;
function addrock(){
    let rand = Math.random();
    if(rand>0.3 && (!(i<squareSide*2&&j<squareSide*2)) && (!(i<squareSide*2&&j+1>lasty-squareSide)) && (!(i+1>lastx-squareSide&&j+1>lasty-squareSide)) && (!(i+1>lastx-squareSide&&j<squareSide*2))){
        rockPos.push([i,j]);
        ctx.drawImage(img,i,j,squareSide,squareSide); 
        if(rand>0.8){
            numPos.push([i.toFixed(2),j.toFixed(2)].toString());
        }
        else if(rand<0.5){
            powerPos.push([i.toFixed(2),j.toFixed(2)].toString());
        }
    }
}

var add = false;
var add2;
for(i = 0; i < gameW; i += squareSide){
    if(add){
        add2 = false;
        for(j = 0; j < gameH-(squareSide); j += squareSide){
            if (add2){
                add2 = false;
                ctx.fillStyle = "rgb(100,0,0)";
                ctx.fillRect(i, j,  squareSide, squareSide);
                ctx.fillStyle = "rgb(150,0,0)";
                ctx.fillRect(i+2, j+2,  squareSide-4, squareSide-4);
            }
            else{
                add2 = true;
                addrock();
            }
        }
        add = false;
        addrock();
    }
    else{
        add = true;
        for(j = 0; j < gameH; j += squareSide){
            addrock();
        }
    }
}

socket.emit('giveCanvas',{rockP:rockPos,numP:numPos,powerP:powerPos});
thisplayer = allPlayers[0];