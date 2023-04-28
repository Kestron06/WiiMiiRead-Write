const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');
const crypto=require("crypto");
const asmCrypto=require("./asmCrypto.js");
const qrCodeJpgFilePath = 'test.png';
var NONCE_OFFSET = 0xC;
var NONCE_LENGTH = 8;
var TAG_LENGTH = 0x10;
var aes_key = new Uint8Array([0x59, 0xFC, 0x81, 0x7E, 0x64, 0x46, 0xEA, 0x61, 0x90, 0x34, 0x7B, 0x20, 0xE9, 0xBD, 0xCE, 0x52]);
var pad = new Uint8Array([0,0,0,0]);
var miiJson={
  info:{},
  perms:{},
  hair:{},
  face:{},
  eyes:{},
  eyebrows:{},
  nose:{},
  mouth:{},
  facialHair:{},
  glasses:{},
  mole:{}
};
var cols=["Red","Orange","Yellow","Lime","Green","Blue","Teal","Pink","Purple","Brown","White","Black"];
var skinCols=["White","Tanned White","Darker White","Tanned Darker","Mostly Black","Black"];
var faceFeatures=["None","Near Eye Creases","Cheek Creases","Far Eye Creases","Near Nose Creases","Giant Bags","Cleft Chin","Chin Crease","Sunken Eyes","Far Cheek Creases","Lines Near Eyes","Wrinkles"];
var makeups=["None","Blush","Orange Blush","Blue Eyes","Blush 2","Orange Blush 2","Blue Eyes and Blush","Orange Eyes and Blush","Purple Eyes and Blush 2","Freckles","Beard Stubble","Beard and Mustache Stubble"];
var eyeCols=["Black","Grey","Brown","Lime","Blue","Green"];
var hairCols=["Black","Brown","Red","Reddish Brown","Grey","Light Brown","Dark Blonde","Blonde"];
var mouthCols=["Orange","Red","Pink","Peach","Black"];
var glassesCols=["Black","Brown","Red","Blue","Yellow","Grey"];
function Uint8Cat(){
  var destLength = 0
  for(var i = 0;i < arguments.length;i++)destLength += arguments[i].length;
  var dest = new Uint8Array(destLength);
  var index = 0;
  for(i = 0;i < arguments.length;i++){
      dest.set(arguments[i],index);
      index += arguments[i].length;
  }
  return dest;
}
function decodeAesCcm(data){
  var nonce = Uint8Cat(data.subarray(0,NONCE_LENGTH),pad);
  var ciphertext = data.subarray(NONCE_LENGTH,0x70);
  var plaintext = asmCrypto.AES_CCM.decrypt(ciphertext,aes_key,nonce,undefined,TAG_LENGTH);
  return Uint8Cat(plaintext.subarray(0,NONCE_OFFSET),data.subarray(0,NONCE_LENGTH),plaintext.subarray(NONCE_OFFSET,plaintext.length - 4));
}
var tables={
    faces: [
        0x00,0x01,0x08,
        0x02,0x03,0x09,
        0x04,0x05,0x0a,
        0x06,0x07,0x0b
    ],
    hairs: [
        [0x21,0x2f,0x28,
        0x25,0x20,0x6b,
        0x30,0x33,0x37,
        0x46,0x2c,0x42],
        [0x34,0x32,0x26,
        0x31,0x2b,0x1f,
        0x38,0x44,0x3e,
        0x73,0x4c,0x77],
        [0x40,0x51,0x74,
        0x79,0x16,0x3a,
        0x3c,0x57,0x7d,
        0x75,0x49,0x4b],
        [0x2a,0x59,0x39,
        0x36,0x50,0x22,
        0x17,0x56,0x58,
        0x76,0x27,0x24],
        [0x2d,0x43,0x3b,
        0x41,0x29,0x1e,
        0x0c,0x10,0x0a,
        0x52,0x80,0x81],
        [0x0e,0x5f,0x69,
        0x64,0x06,0x14,
        0x5d,0x66,0x1b,
        0x04,0x11,0x6e],
        [0x7b,0x08,0x6a,
        0x48,0x03,0x15,
        0x00,0x62,0x3f,
        0x5a,0x0b,0x78],
        [0x05,0x4a,0x6c,
        0x5e,0x7c,0x19,
        0x63,0x45,0x23,
        0x0d,0x7a,0x71],
        [0x35,0x18,0x55,
        0x53,0x47,0x83,
        0x60,0x65,0x1d,
        0x07,0x0f,0x70],
        [0x4f,0x01,0x6d,
        0x7f,0x5b,0x1a,
        0x3d,0x67,0x02,
        0x4d,0x12,0x5c],
        [0x54,0x09,0x13,
        0x82,0x61,0x68,
        0x2e,0x4e,0x1c,
        0x72,0x7e,0x6f]
    ],
    eyebrows: [
        [0x06,0x00,0x0c,
        0x01,0x09,0x13,
        0x07,0x15,0x08,
        0x11,0x05,0x04],
        [0x0b,0x0a,0x02,
        0x03,0x0e,0x14,
        0x0f,0x0d,0x16,
        0x12,0x10,0x17]
    ],
    eyes: [
        [0x02,0x04,0x00,
        0x08,0x27,0x11,
        0x01,0x1a,0x10,
        0x0f,0x1b,0x14],
        [0x21,0x0b,0x13,
        0x20,0x09,0x0c,
        0x17,0x22,0x15,
        0x19,0x28,0x23],
        [0x05,0x29,0x0d,
        0x24,0x25,0x06,
        0x18,0x1e,0x1f,
        0x12,0x1c,0x2e],
        [0x07,0x2c,0x26,
        0x2a,0x2d,0x1d,
        0x03,0x2b,0x16,
        0x0a,0x0e,0x2f],
        [0x30,0x31,0x32,
        0x35,0x3b,0x38,
        0x36,0x3a,0x39,
        0x37,0x33,0x34]
    ],
    noses: [
        [0x01,0x0a,0x02,
        0x03,0x06,0x00,
        0x05,0x04,0x08,
        0x09,0x07,0x0B],
        [0x0d,0x0e,0x0c,
        0x11,0x10,0x0f]
    ],
    mouths: [
        [0x17,0x01,0x13,
        0x15,0x16,0x05,
        0x00,0x08,0x0a,
        0x10,0x06,0x0d],
        [0x07,0x09,0x02,
        0x11,0x03,0x04,
        0x0f,0x0b,0x14,
        0x12,0x0e,0x0c],
        [0x1b,0x1e,0x18,
        0x19,0x1d,0x1c,
        0x1a,0x23,0x1f,
        0x22,0x21,0x20]
    ]
};
function lookupTable(table,value,paginated){
  if(paginated){
    for(var i=0;i<tables[table].length;i++){
      for(var j=0;j<tables[table][i].length;j++){
        if(tables[table][i][j]===value){
          return [i,j];
        }
      }
    }
  }
  else{
    for(var i=0;i<tables[table].length;i++){
      if(tables[table][i]===value){
        return i;
      }
    }
  }
  return undefined;
}
function readMii(){
  var binary=fs.readFileSync("./decrypted.mii");
  function getBinaryFromAddress(addr){//EG: 0x20
    let byte = binary.readUInt8(addr);
    let binaryString = '';
    for (let i = 7; i >= 0; i--) {
        binaryString += ((byte >> i) & 1) ? '1' : '0';
    }
    return binaryString;
  }
  var temp=getBinaryFromAddress(0x18);
  var temp2=getBinaryFromAddress(0x19);
  miiJson.info.birthday=parseInt(temp2.slice(6,8)+temp.slice(0,3),2);
  miiJson.info.birthMonth=parseInt(temp.slice(4,7),2);
  var name="";
  for(var i=0x1A;i<0x2E;i++){
      name+=binary.slice(i,i+1);
  }
  miiJson.name=name.replaceAll("\x00","");
  var cname="";
  for(var i=0x48;i<0x5C;i++){
      cname+=binary.slice(i,i+1);
  }
  miiJson.creatorName=cname.replaceAll("\x00","");
  miiJson.info.creatorName=miiJson.creatorName;
  miiJson.info.weight=parseInt(getBinaryFromAddress(0x2E),2);
  miiJson.info.height=parseInt(getBinaryFromAddress(0x2F),2);
  miiJson.info.gender=temp[7]==="1"?"Female":"Male";
  temp=getBinaryFromAddress(0x30);
  miiJson.perms.sharing=temp[7]==="1"?false:true;
  miiJson.info.favColor=cols[parseInt(temp2.slice(2,6),2)];
  miiJson.perms.copying=getBinaryFromAddress(0x01)[7]==="1"?true:false;
  miiJson.hair.style=lookupTable("hairs",parseInt(getBinaryFromAddress(0x32),2),true);
  miiJson.face.shape=lookupTable("faces",parseInt(temp.slice(3,7),2),false);
  miiJson.face.col=skinCols[parseInt(temp.slice(0,3),2)];
  temp=getBinaryFromAddress(0x31);
  miiJson.face.feature=faceFeatures[parseInt(temp.slice(4,8),2)];
  miiJson.face.makeup=makeups[parseInt(temp.slice(0,4),2)];
  temp=getBinaryFromAddress(0x34);
  miiJson.eyes.type=lookupTable("eyes",parseInt(temp.slice(2,8),2),true);
  temp2=getBinaryFromAddress(0x33);
  miiJson.eyes.col=eyeCols[parseInt(temp2[7]+temp.slice(0,2),2)];
  temp=getBinaryFromAddress(0x35);
  miiJson.eyes.size=parseInt(temp.slice(3,7),2);
  miiJson.eyes.squash=parseInt(temp.slice(0,3),2);
  temp=getBinaryFromAddress(0x36);
  temp2=getBinaryFromAddress(0x37);
  miiJson.eyes.rot=parseInt(temp.slice(3,8),2);
  miiJson.eyes.distApart=parseInt(temp2[7]+temp.slice(0,3),2);
  miiJson.eyes.yPos=parseInt(temp2.slice(2,7),2);
  temp=getBinaryFromAddress(0x38);
  miiJson.eyebrows.style=lookupTable("eyebrows",parseInt(temp.slice(3,8),2),true);
  miiJson.eyebrows.col=hairCols[parseInt(temp.slice(0,3),2)];
  temp=getBinaryFromAddress(0x39);
  miiJson.eyebrows.size=parseInt(temp.slice(4,8),2);
  miiJson.eyebrows.squash=parseInt(temp.slice(1,4),2);
  temp=getBinaryFromAddress(0x3A);
  miiJson.eyebrows.rot=parseInt(temp.slice(4,8),2);
  temp2=getBinaryFromAddress(0x3B);
  miiJson.eyebrows.distApart=parseInt(temp2[7]+temp.slice(0,3),2);
  miiJson.eyebrows.yPos=parseInt(temp2.slice(2,7),2)-3;
  temp=getBinaryFromAddress(0x3C);
  miiJson.nose.type=lookupTable("noses",parseInt(temp.slice(3,8),2),true);
  temp2=getBinaryFromAddress(0x3D);
  miiJson.nose.size=parseInt(temp2[7]+temp.slice(0,3),2);
  miiJson.nose.yPos=parseInt(temp2.slice(2,7),2);
  temp=getBinaryFromAddress(0x3E);
  miiJson.mouth.type=lookupTable("mouths",parseInt(temp.slice(2,8),2),true);
  temp2=getBinaryFromAddress(0x3F);
  miiJson.mouth.col=mouthCols[parseInt(temp2[7]+temp.slice(0,2),2)];
  miiJson.mouth.size=parseInt(temp2.slice(3,7),2);
  miiJson.mouth.squash=parseInt(temp2.slice(0,3),2);
  temp=getBinaryFromAddress(0x40);
  miiJson.mouth.yPos=parseInt(temp.slice(3,8),2);
  miiJson.facialHair.mustacheType=parseInt(temp.slice(0,3),2);
  temp=getBinaryFromAddress(0x42);
  miiJson.facialHair.beardType=parseInt(temp.slice(5,8),2);
  miiJson.facialHair.col=hairCols[parseInt(temp.slice(2,5),2)];
  temp2=getBinaryFromAddress(0x43);
  miiJson.facialHair.mustacheSize=parseInt(temp2.slice(6,8)+temp.slice(0,2),2);
  miiJson.facialHair.mustacheYPos=parseInt(temp2.slice(1,6),2);
  temp=getBinaryFromAddress(0x44);
  miiJson.glasses.type=parseInt(temp.slice(4,8),2);
  miiJson.glasses.col=glassesCols[parseInt(temp.slice(1,4),2)];
  temp2=getBinaryFromAddress(0x45);
  miiJson.glasses.size=parseInt(temp2.slice(5,8)+temp[7],2);
  miiJson.glasses.yPos=parseInt(temp2.slice(1,5),2);
  temp=getBinaryFromAddress(0x46);
  miiJson.mole.on=temp[7]==="0"?false:true;
  miiJson.mole.size=parseInt(temp.slice(3,7),2);
  temp2=getBinaryFromAddress(0x47);
  miiJson.mole.xPos=parseInt(temp2.slice(6,8)+temp.slice(0,3),2);
  miiJson.mole.yPos=parseInt(temp2.slice(1,6),2);
  console.log(miiJson);
  /*
  00000001 - 1
  00000010 - 2
  00000100 - 4
  00001000 - 8
  00010000 - 16
  00100000 - 32
  01000000 - 64
  10000000 - 128
  */
}
fs.readFile("./maddie.jpg", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  loadImage(data).then((img) => {
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (qrCode) {
      var data = decodeAesCcm(new Uint8Array(qrCode.binaryData));
      fs.writeFileSync("./decrypted.mii",Buffer.from(data));
      readMii();
    } else {
      console.error('Failed to decode QR code');
    }
  });
});
