const fs=require("fs");
var binary=fs.readFileSync("./Maddie.mii");
function getBinaryFromAddress(addr){//EG: 0x20
    let byte = binary.readUInt8(addr);
    let binaryString = '';
    for (let i = 7; i >= 0; i--) {
        binaryString += ((byte >> i) & 1) ? '1' : '0';
    }
    return binaryString;
}
var bin="";
for(var i=0x00;i<0x50;i++){
    try{
        bin+=i===0x18?"01000110":getBinaryFromAddress(i);
        if(i===0x21){
            bin[bin.length-3]="1";
        }
    }
    catch(e){

    }
}
var toWrite=bin.match(/.{1,8}/g);
var buffers=[];
for(var i=0;i<toWrite.length;i++){
    buffers.push(parseInt(toWrite[i],2));
}
const buffer = Buffer.from(buffers);
fs.writeFileSync("./Maddie-Special.mii", buffer);