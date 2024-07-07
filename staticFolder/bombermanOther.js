
var numPos;
var powerPos;
function fillCanvas(msg){
    for(i=0;i<msg.rockP.length;i++){
        ctx.drawImage(img,msg.rockP[i][0],msg.rockP[i][1],squareSide,squareSide);
    }
    numPos = msg.numP;
    powerPos = msg.powerP;
}
var add = true;
var add2;
for(i = squareSide; i < gameW-(squareSide); i += squareSide){
    if(add){
        add2 = true
        for(j = squareSide; j < gameH-(squareSide); j += squareSide){
            if (add2){
                ctx.fillStyle = "rgb(100,0,0)";
                ctx.fillRect(i, j,  squareSide, squareSide);
                ctx.fillStyle = "rgb(150,0,0)";
                ctx.fillRect(i+2, j+2,  squareSide-4, squareSide-4);
                add2 = false;
            }
            else{
                add2 = true;
            }
        }
        add = false;
    }
    else{
        add = true;
    }
}

otherLoaded = true;