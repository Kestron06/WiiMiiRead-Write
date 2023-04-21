const fs=require("fs");
var cols=["Red","Orange","Yellow","Lime","Green","Blue","Light Blue","Pink","Purple","Brown","White","Black"];
var faceFeatures=["None","Blush","Makeup and Blush","Freckles","Bags","Wrinkles on Cheeks","Wrinkles near Eyes","Chin Wrinkle","Makeup","Stubble","Wrinkles near Mouth","Wrinkles"];
var skinColors=["White","Tanned White","Darker Skin","Tanned Darker","Mostly Black","Black"];
var mouthColors=["Peach","Red","Pink"];
var hairCols=["Black","Dark Brown","Mid Brown","Brown","Grey","Wooden Brown","Dark Blonde","Blonde"];
var eyeCols=["Black","Grey","Brown","Lime","Blue","Green"];
var glassesCols=["Grey","Brown","Red","Blue","Yellow","White"];
var mouthTable={
    '0': '113',
    '1': '121',
    '2': '231',
    '3': '222',
    '4': '232',
    '5': '132',
    '6': '124',
    '7': '211',
    '8': '123',
    '9': '221',
    '10': '133',
    '11': '223',
    '12': '234',
    '13': '134',
    '14': '224',
    '15': '213',
    '16': '114',
    '17': '212',
    '18': '214',
    '19': '131',
    '20': '233',
    '21': '112',
    '22': '122',
    '23': '111'
};
var eyebrowTable={
    '0': '121',
    '1': '112',
    '2': '231',
    '3': '212',
    '4': '134',
    '5': '124',
    '6': '111',
    '7': '113',
    '8': '133',
    '9': '122',
    '10': '221',
    '11': '211',
    '12': '131',
    '13': '223',
    '14': '222',
    '15': '213',
    '16': '224',
    '17': '114',
    '18': '214',
    '19': '132',
    '20': '232',
    '21': '123',
    '22': '233',
    '23': '234'
};
var eyeTable={
    '0': '131',
    '1': '113',
    '2': '111',
    '3': '413',
    '4': '121',
    '5': '311',
    '6': '332',
    '7': '411',
    '8': '112',
    '9': '222',
    '10': '414',
    '11': '221',
    '12': '232',
    '13': '331',
    '14': '424',
    '15': '114',
    '16': '133',
    '17': '132',
    '18': '314',
    '19': '231',
    '20': '134',
    '21': '233',
    '22': '433',
    '23': '213',
    '24': '313',
    '25': '214',
    '26': '123',
    '27': '124',
    '28': '324',
    '29': '432',
    '30': '323',
    '31': '333',
    '32': '212',
    '33': '211',
    '34': '223',
    '35': '234',
    '36': '312',
    '37': '322',
    '38': '431',
    '39': '122',
    '40': '224',
    '41': '321',
    '42': '412',
    '43': '423',
    '44': '421',
    '45': '422',
    '46': '334',
    '47': '434'
};
var hairTable={
    '0': '534',
    '1': '413',
    '2': '632',
    '3': '521',
    '4': '422',
    '5': '433',
    '6': '522',
    '7': '434',
    '8': '414',
    '9': '612',
    '10': '512',
    '11': '513',
    '12': '411',
    '13': '421',
    '14': '511',
    '15': '624',
    '16': '621',
    '17': '533',
    '18': '622',
    '19': '423',
    '20': '532',
    '21': '524',
    '22': '531',
    '23': '312',
    '24': '614',
    '25': '432',
    '26': '412',
    '27': '424',
    '28': '613',
    '29': '634',
    '30': '314',
    '31': '134',
    '32': '211',
    '33': '111',
    '34': '334',
    '35': '514',
    '36': '313',
    '37': '231',
    '38': '321',
    '39': '122',
    '40': '121',
    '41': '323',
    '42': '331',
    '43': '311',
    '44': '112',
    '45': '113',
    '46': '631',
    '47': '221',
    '48': '212',
    '49': '123',
    '50': '223',
    '51': '131',
    '52': '232',
    '53': '623',
    '54': '332',
    '55': '233',
    '56': '114',
    '57': '324',
    '58': '213',
    '59': '133',
    '60': '224',
    '61': '611',
    '62': '234',
    '63': '523',
    '64': '214',
    '65': '333',
    '66': '222',
    '67': '322',
    '68': '124',
    '69': '431',
    '70': '132',
    '71': '633'
};
function getKeyByValue(object, value) {
    for (var key in object) {
      if (object[key] === value) {
        return key;
      }
    }
}

function writeMiiBinaryFileFromJSON(mii){
    var miiBin="0";
    miiBin+=mii.info.gender==="Male"?"0":"1";
    miiBin+=mii.info.birthMonth.toString(2).padStart(4,"0");
    miiBin+=mii.info.birthday.toString(2).padStart(5,"0");
    miiBin+=cols.indexOf(mii.info.favColor).toString(2).padStart(4,"0");
    miiBin+=mii.info.favorited?1:0;
    for(var i=0;i<10;i++){
        miiBin+="00000000";
        if(i<mii.name.length){
            miiBin+=mii.name.charCodeAt(i).toString(2).padStart(8,"0");
        }
        else{
            miiBin+="00000000";
        }
    }
    miiBin+=mii.info.height.toString(2).padStart(8,"0");
    miiBin+=mii.info.weight.toString(2).padStart(8,"0");
    if(mii.systemID&&mii.miiID &&false){

    }
    else{
        miiBin+="11111111".repeat(8);
    }
    miiBin+=mii.face.shape.toString(2).padStart(3,"0");
    miiBin+=skinColors.indexOf(mii.face.col).toString(2).padStart(3,"0");
    miiBin+=faceFeatures.indexOf(mii.face.feature).toString(2).padStart(4,"0");
    miiBin+="000";
    miiBin+=mii.info.mingle?"0":"1";
    miiBin+="0";
    miiBin+=mii.info.downloadedFromCheckMiiOut?"1":"0";
    miiBin+=(+getKeyByValue(hairTable,mii.hair.type)).toString(2).padStart(7,"0");
    miiBin+=hairCols.indexOf(mii.hair.col).toString(2).padStart(3,"0");
    miiBin+=mii.hair.flipped?"1":"0";
    miiBin+="00000";
    miiBin+=(+getKeyByValue(eyebrowTable,mii.eyebrows.type)).toString(2).padStart(5,"0");
    miiBin+="0";
    miiBin+=mii.eyebrows.rotation.toString(2).padStart(4,"0");
    miiBin+="000000";
    miiBin+=hairCols.indexOf(mii.eyebrows.col).toString(2).padStart(3,"0");
    miiBin+=mii.eyebrows.size.toString(2).padStart(4,"0");
    miiBin+=mii.eyebrows.yPos.toString(2).padStart(5,"0");
    miiBin+=mii.eyebrows.distApart.toString(2).padStart(4,"0");
    miiBin+=(+getKeyByValue(eyeTable,mii.eyes.type)).toString(2).padStart(6,"0");
    miiBin+="00";
    miiBin+=mii.eyes.rotation.toString(2).padStart(3,"0");
    miiBin+=mii.eyes.yPos.toString(2).padStart(5,"0");
    miiBin+=eyeCols.indexOf(mii.eyes.col).toString(2).padStart(3,"0");
    miiBin+="0";
    miiBin+=mii.eyes.size.toString(2).padStart(3,"0");
    miiBin+=mii.eyes.distApart.toString(2).padStart(4,"0");
    miiBin+="00000";
    miiBin+=mii.nose.type.toString(2).padStart(4,"0");
    miiBin+=mii.nose.size.toString(2).padStart(4,"0");
    miiBin+=mii.nose.vertPos.toString(2).padStart(5,"0");
    miiBin+="000";
    miiBin+=(+getKeyByValue(mouthTable,mii.mouth.type)).toString(2).padStart(5,"0");
    miiBin+=mouthColors.indexOf(mii.mouth.col).toString(2).padStart(2,"0");
    miiBin+=mii.mouth.size.toString(2).padStart(4,"0");
    miiBin+=mii.mouth.yPos.toString(2).padStart(5,"0");
    miiBin+=mii.glasses.type.toString(2).padStart(4,"0");
    miiBin+=glassesCols.indexOf(mii.glasses.col).toString(2).padStart(3,"0");
    miiBin+="0";
    miiBin+=mii.glasses.size.toString(2).padStart(3,"0");
    miiBin+=mii.glasses.yPos.toString(2).padStart(5,"0");
    miiBin+=mii.facialHair.mustacheType.toString(2).padStart(2,"0");
    miiBin+=mii.facialHair.beardType.toString(2).padStart(2,"0");
    miiBin+=hairCols.indexOf(mii.facialHair.col).toString(2).padStart(3,"0");
    miiBin+=mii.facialHair.mustacheSize.toString(2).padStart(4,"0");
    miiBin+=mii.facialHair.mustacheYPos.toString(2).padStart(5,"0");
    miiBin+=mii.mole.on?"1":"0";
    miiBin+=mii.mole.size.toString(2).padStart(4,"0");
    miiBin+=mii.mole.yPos.toString(2).padStart(5,"0");
    miiBin+=mii.mole.xPos.toString(2).padStart(5,"0");
    miiBin+="0";
    for(var i=0;i<10;i++){
        miiBin+="00000000";
        if(i<mii.creatorName.length){
            miiBin+=mii.creatorName.charCodeAt(i).toString(2).padStart(8,"0");
        }
        else{
            miiBin+="00000000";
        }
    }
    
    //Writing based on miiBin
    var toWrite=miiBin.match(/.{1,8}/g);
    var buffers=[];
    for(var i=0;i<toWrite.length;i++){
        buffers.push(parseInt(toWrite[i],2));
    }
    const buffer = Buffer.from(buffers);
    fs.writeFileSync('./'+mii.name+".mii", buffer);
}
var Mii=require("./mii.js").mii;//Assuming you have exports.mii=MII JSON OUTPUT
writeMiiBinaryFileFromJSON(Mii);