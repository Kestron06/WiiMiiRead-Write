var fs = require('fs');
var miis=[];
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
function readMiiBinaryFile(path){
    function getBinaryFromAddress(addr){//EG: 0x20
        let byte = binary.readUInt8(addr);
        let binaryString = '';
        for (let i = 7; i >= 0; i--) {
            binaryString += ((byte >> i) & 1) ? '1' : '0';
        }
        return binaryString;
    }
    var thisMii={
        filename:path,
        info:{},
        face:{},
        nose:{},
        mouth:{},
        mole:{},
        hair:{},
        eyebrows:{},
        eyes:{},
        glasses:{},
        facialHair:{}
    };
    var binary = fs.readFileSync(path);
    var name="";
    for(var i=0;i<10;i++){
        name+=binary.slice(3+i*2, 4+i*2)+"";
    }
    thisMii.name=name.replaceAll("\x00","");
    var cname="";
    for(var i=0;i<10;i++){
        cname+=binary.slice(55+i*2, 56+i*2)+"";
    }
    thisMii.creatorName=cname.replaceAll("\x00","");
    thisMii.info.creatorName=thisMii.creatorName;
    thisMii.info.name=thisMii.name;//Up to ten characters
    thisMii.info.gender=getBinaryFromAddress(0x00)[1]==="1"?"Female":"Male";//0 for Male, 1 for Female
    var temp=getBinaryFromAddress(0x20);
    thisMii.face.shape=parseInt(temp.slice(0,3),2);//0-7
    thisMii.face.col=skinColors[parseInt(temp.slice(3,6),2)];//0-5
    temp=getBinaryFromAddress(0x21);
    thisMii.face.feature=faceFeatures[parseInt(temp.slice(0,4),2)];//0-11
    thisMii.info.mingle=temp[5]==="1"?false:true;//0 for Mingle, 1 for Don't Mingle
    temp=getBinaryFromAddress(0x2C);
    thisMii.nose.type=parseInt(temp.slice(0,4),2);
    thisMii.nose.size=parseInt(temp.slice(4,8),2);
    thisMii.nose.vertPos=parseInt(getBinaryFromAddress(0x2D).slice(0,5),2);//From bottom to top, 0-18, default 9
    temp=getBinaryFromAddress(0x2E);
    thisMii.mouth.type=mouthTable[""+parseInt(temp.slice(0,5),2)];//0-23, Needs lookup table
    thisMii.mouth.col=mouthColors[parseInt(temp.slice(5,7),2)];//0-2, refer to mouthColors array
    temp2=getBinaryFromAddress(0x2F);
    thisMii.mouth.size=parseInt(temp[7]+temp2.slice(0,3),2);//0-8, default 4
    thisMii.mouth.yPos=parseInt(temp2.slice(3,8),2);//0-18, default 9
    temp=getBinaryFromAddress(0x00);
    var temp2=getBinaryFromAddress(0x01);
    thisMii.info.birthMonth=parseInt(temp.slice(2,6),2);
    thisMii.info.birthday=parseInt(temp.slice(6,8)+temp2.slice(0,3),2);
    thisMii.info.favColor=cols[parseInt(temp2.slice(3,7),2)];//0-11, refer to cols array
    thisMii.info.favorited=temp2[7]==="0"?false:true;
    thisMii.info.height=parseInt(getBinaryFromAddress(0x16),2);//0-127
    thisMii.info.weight=parseInt(getBinaryFromAddress(0x17),2);//0-127
    thisMii.info.downloadedFromCheckMiiOut=getBinaryFromAddress(0x21)[7]==="0"?false:true;
    temp=getBinaryFromAddress(0x34);
    temp2=getBinaryFromAddress(0x35);
    thisMii.mole.on=temp[0]==="0"?false:true;//0 for Off, 1 for On
    thisMii.mole.size=parseInt(temp.slice(1,5),2);//0-8, default 4
    thisMii.mole.xPos=parseInt(temp2.slice(2,7),2);//0-16, Default 2
    thisMii.mole.yPos=parseInt(temp.slice(5,8)+temp2.slice(0,2),2);
    temp=getBinaryFromAddress(0x22);
    temp2=getBinaryFromAddress(0x23);
    thisMii.hair.type=hairTable[""+parseInt(temp.slice(0,7),2)];//0-71, Needs lookup table
    thisMii.hair.col=hairCols[parseInt(temp[7]+temp2.slice(0,2),2)];//0-7, refer to hairCols array
    thisMii.hair.flipped=temp2[2]==="0"?false:true;
    temp=getBinaryFromAddress(0x24);
    temp2=getBinaryFromAddress(0x25);
    thisMii.eyebrows.type=eyebrowTable[""+parseInt(temp.slice(0,5),2)];//0-23, Needs lookup table
    thisMii.eyebrows.rotation=parseInt(temp.slice(6,8)+temp2.slice(0,2),2);//0-11, default varies based on eyebrow type
    temp=getBinaryFromAddress(0x26);
    temp2=getBinaryFromAddress(0x27);
    thisMii.eyebrows.col=hairCols[parseInt(temp.slice(0,3),2)];
    thisMii.eyebrows.size=parseInt(temp.slice(3,7),2);//0-8, default 4
    thisMii.eyebrows.yPos=parseInt(temp[7]+temp2.slice(0,4),2);//0-18, default 10
    thisMii.eyebrows.distApart=parseInt(temp2.slice(4,8),2);//0-12, default 2
    thisMii.eyes.type=eyeTable[parseInt(getBinaryFromAddress(0x28).slice(0,6),2)];//0-47, needs lookup table
    temp=getBinaryFromAddress(0x29);
    thisMii.eyes.rotation=parseInt(temp.slice(0,3),2);//0-7, default varies based on eye type
    thisMii.eyes.yPos=parseInt(temp.slice(3,8),2);//0-18, default 12, top to bottom
    temp=getBinaryFromAddress(0x2A);
    thisMii.eyes.col=eyeCols[parseInt(temp.slice(0,3),2)];//0-5
    thisMii.eyes.size=parseInt(temp.slice(4,7),2);//0-7, default 4
    temp2=getBinaryFromAddress(0x2B);
    thisMii.eyes.distApart=parseInt(temp[7]+temp2.slice(0,3),2);//0-12, default 2
    temp=getBinaryFromAddress(0x30);
    thisMii.glasses.type=parseInt(temp.slice(0,4),2);//0-8
    thisMii.glasses.col=glassesCols[parseInt(temp.slice(4,7),2)];//0-5
    temp=getBinaryFromAddress(0x31);
    thisMii.glasses.size=parseInt(temp.slice(0,3),2);//0-7, default 4
    thisMii.glasses.yPos=parseInt(temp.slice(3,8),2);//0-20, default 10
    temp=getBinaryFromAddress(0x32);
    temp2=getBinaryFromAddress(0x33);
    thisMii.facialHair.mustacheType=parseInt(temp.slice(0,2),2);//0-3
    thisMii.facialHair.beardType=parseInt(temp.slice(2,4),2);//0-3
    thisMii.facialHair.col=hairCols[parseInt(temp.slice(4,7),2)];//0-7
    thisMii.facialHair.mustacheSize=parseInt(temp[7]+temp2.slice(0,3),2);//0-30, default 20
    thisMii.facialHair.mustacheYPos=parseInt(temp2.slice(3,8),2);//0-16, default 2
    return thisMii;
}
console.log(readMiiBinaryFile("./Maddie.mii"));
