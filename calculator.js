var readline = require('readline-sync');
var os =require('os');
var iface= os.networkInterfaces();
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;

var ipFromUser = process.argv[2];
var ipTab=[];
var ipTabBinary=[];
var ip;


 function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.cidr;
        }
    }

    return '0.0.0.0';
}
function checkIpIfOk(){
     if(ipTab.size>4){
         return false;
     }
     if(!maskIndex){
         return false}

    if(maskIndex[0]>32){
        return false;
    }
    for(let i=0;i<5;i++)
        if(ipTab[i]>255||ipTab<255){
            return false;
        }
    return true;
}
function makeMaskBinary(maskNumber){
    var tempString="";
    for(let i =0;i<maskNumber;i++){
        tempString+="1";
    }
    var buff = 32-maskNumber;
    for(let i=0;i<buff;i++)
    {
        tempString+="0";

    }var  maskBinaryString = tempString.match(/.{1,8}/g);


    return maskBinaryString;
}


function networkAdress(ip=[],mask=[]){

     var ipString=ip.join("");

     var maskString=mask.join("");

     var networkAdress="";

    for (let i=0;i<32;i++){
        if(ipString[i]=="1"&&maskString[i]=="1"){
            networkAdress+="1";
        }
        else{
            networkAdress+="0";
        }
    }

    var networkAddresArray=networkAdress.match(/.{1,8}/g);
    return networkAddresArray;

}



function broadcastAdress(maskBin=[], ip=[]){
     var tempString = maskBin.join("");
     var broadcastString="";


     for(let i=0;i<32;i++) {
         if (tempString[i] == "1") {
             broadcastString += "0";
         } else if (tempString[i] == "0") {
             broadcastString += "1";
         }
     }

    var broadcastAdressArray=broadcastString.match(/.{1,8}/g);


   var decArray=[4];
   var decIp=[4];

   decArray[0] =parseInt(broadcastAdressArray[0],2);
   decArray[1]=parseInt(broadcastAdressArray[1],2);
   decArray[2]=parseInt(broadcastAdressArray[2],2);
   decArray[3]=parseInt(broadcastAdressArray[3],2);

   decIp[0]=parseInt(ip[0],2);
   decIp[1]=parseInt(ip[1],2);
   decIp[2]=parseInt(ip[2],2);
   decIp[3]=parseInt(ip[3],2);



   for(let i=0;i<4;i++){
       decArray[i]+=decIp[i];
   }

    for (let i = 0; i < 4; i++) {
        broadcastAdressArray[i] = ("00000000" + decArray[i].toString(2)).substr(-8);
    }


    return broadcastAdressArray;
}


function binaryToDecimal(temp=[]){
     var tempString= "";

     for(let i=0;i<4;i++){
         tempString+=String(parseInt(temp[i],2));
         if(i<3){
             tempString+=".";
         }
     }
     return tempString;
}


function ipClass(ip=[]){
     if(parseInt(ip[0],2)<127){
         console.log("Class A address");
         return "A";
     }
     else if(parseInt(ip[0],2)>127&&parseInt(ip[0],2)<192&&parseInt(ip[1],2)<255){
         console.log("Class B address");
         return "B"
     }
     else if(parseInt(ip[0],2)>191&&parseInt(ip[1],2)<224&&parseInt(ip[2],2)<255){
         console.log("Class C address");
         return "C";
     }
     else if(parseInt(ip[0],2)>223&&parseInt(ip[0],2)<240&&parseInt(ip[3],2)<255){
         console.log("Class D address");
         return "D";
     }
     else{
         console.log("Class E address");
         return "E";
     }
}


function isPrivate(ip=[]){
     if(parseInt(ip[0],2)==10&&parseInt(ip[3],2)<256){
         console.log("Private");
         return true;
     }
     else if(parseInt(ip[0],2)==172&&parseInt(ip[1],2)>15&&parseInt(ip[1],2)<32){
         console.log("Private");
         return true;
     }
     else if(parseInt(ip[0],2)==192&&parseInt(ip[1],2)==168){
         console.log("Private");
         return true;
     }

     else if(parseInt(ip[0],2)==127){
         console.log("Local host");
         return true;
     }
    else if(parseInt(ip[0],2)==255&&parseInt(ip[1],2)==255&&parseInt(ip[2],2)==255&&parseInt[ip[3],2]==255){
         console.log("Broadcast");
         return true;
     }
    else{
     console.log("Public");
     return false;
    }
}


function firstHost(ip=[]){
     var ipDec=[4];
     ipDec[0]=parseInt(ip[0],2);
     ipDec[1]=parseInt(ip[1],2);
     ipDec[2]=parseInt(ip[2],2);
     ipDec[3]=parseInt(ip[3],2);

     if(ipDec[3]<255){
         ipDec[3]++;
     }

     var hostArray=[4];
    for (let i = 0; i < 4; i++) {
        hostArray[i] = ("00000000" + ipDec[i].toString(2)).substr(-8);
    }
     return hostArray;
}

function lastHost(ip=[]){
    var ipDec=[4];
    ipDec[0]=parseInt(ip[0],2);
    ipDec[1]=parseInt(ip[1],2);
    ipDec[2]=parseInt(ip[2],2);
    ipDec[3]=parseInt(ip[3],2);

    if(ipDec[3]>0){
        ipDec[3]--;
    }

    var lastHostArray=[4];

    for (let i = 0; i < 4; i++) {
        lastHostArray[i] = ("00000000" + ipDec[i].toString(2)).substr(-8);
    }

    return lastHostArray;

}


function maxHostsNumber(maskInd){
     var pow = 32-maskInd;
     return (Math.pow(2,pow))-2;
}


function isHostAdress(firstHost=[],lastHost=[],ip=[]){

     var firstHostDec=parseInt(firstHost[3],2);
     var lastHostDec=parseInt(lastHost[3],2);
     var ipDec=parseInt(ip[3],2);

     if(ipDec>firstHostDec&&ipDec<lastHostDec){
         return true;
     }
     else{
         return false;
     }

}
function toString(temp=[]){
     var tempString="";
     for(let i=0;i<4;i++){
         tempString+=temp[i];
         if(i<3) {
             tempString += "."
         }
     }
     return tempString;
}


//getting localIP  if not given and adding to array
if(!ipFromUser){
    var ipFromLocal=getIPAddress();
    var ipAndMaskFromLocal=ipFromLocal.split("/");
    xs2=ipAndMaskFromLocal[0];
    maskIndex=ipAndMaskFromLocal[1];
    ipTab=xs2.split(".");
    ipTab.push(maskIndex);
}
//adding ip from user to array
else{

for(let i=0;i<4;i++) {
    var ipAndMask=ipFromUser.split("/");
    xs2=ipAndMask[0];
    maskIndex=ipAndMask[1];
    ipTab=xs2.split(".");
    ipTab.push(maskIndex);

}
}
//Float parsing
for(let i=0;i<5;i++){
    ipTab[i]=parseFloat(ipTab[i]);
}


if(checkIpIfOk()===false){
    throw("Invalid IP");
    // console.log("Podales zle IP, koniec programu");
    return;
}


else {
    // Changing IP to binary
    for (let i = 0; i < 4; i++) {
        ipTabBinary[i] = ("00000000" + ipTab[i].toString(2)).substr(-8);
    }


    console.log("Ip na ktorym pracuje");
    if(ipFromUser){
        console.log(ipFromUser);
         ip=ipFromUser;
    }
    else {
        console.log(ipFromLocal);
         ip=ipFromLocal
    }



    var ipDecimal=binaryToDecimal(ipTabBinary);

    console.log("Ip binary");
    var ipTabBinaryString = toString(ipTabBinary);
    console.log(ipTabBinaryString);

    console.log("Mask binary");
    var maskBinary = makeMaskBinary(parseInt(maskIndex))
    var maskBinaryString=toString(maskBinary);
    console.log(maskBinaryString);


    console.log("Mask decimal");
    var maskDec=binaryToDecimal(makeMaskBinary(parseInt(maskIndex)));
    console.log(maskDec);

var networkAddres=networkAdress(ipTabBinary,makeMaskBinary(parseInt(maskIndex)));
var networkAddressString = toString(networkAddres);

console.log("Network adres")
console.log(networkAddressString);

var networkAddresDec=binaryToDecimal(networkAddres);

console.log("Network adress dec");
console.log(networkAddresDec);

var broadcastAddres = broadcastAdress(maskBinary,networkAddres);
var broadcastAddresString=toString(broadcastAddres);

console.log("Broadcast adrress binary");
console.log(broadcastAddresString);

var broadcastAdressDec = binaryToDecimal(broadcastAddres);
console.log("Broadcast adress decimal");
console.log(broadcastAdressDec);

console.log("Ip class");
var ipClassDec=ipClass(networkAddres);

var private = isPrivate(networkAddres);

var maxHosts=maxHostsNumber(maskIndex);


var firstHost = firstHost(networkAddres);
var firstHostString=toString(firstHost);

var firstHostDec=binaryToDecimal(firstHost);

var lastHost = lastHost(broadcastAddres);
var lastHostString = toString(lastHost)
var lastHostDec=binaryToDecimal(lastHost);

console.log("First host");
console.log(firstHostString);
console.log(firstHostDec);

console.log("Last host");
console.log(lastHostString);
console.log(lastHostDec);

    console.log("Max host number");
    console.log(maxHostsNumber(maskIndex));


fs.writeFileSync("result.txt",ip +'\r\n'+ "Ip Binary"+'\r\n'+ ipTabBinaryString +'\r\n'+ "Mask binary" +'\r\n'+maskBinaryString+'\r\n'+"Mask Decimal"+'\r\n'+maskDec+'\r\n'+"Network address"+'\r\n'+networkAddressString+'\r\n'+"Network address decimal" +'\r\n'+networkAddresDec +'\r\n'+"Broadcast address"+'\r\n'+broadcastAddresString+'\r\n'+"Broadcast address decimal"+'\r\n'+broadcastAdressDec+'\r\n'+ "Address class"+'\r\n'+ipClassDec+'\r\n'+"Is private?"+'\r\n'+private+'\r\n'+"First host"+'\r\n'+firstHostString+'\r\n'+firstHostDec+'\r\n'+"Last host"+'\r\n'+lastHostString+'\r\n'+lastHostDec+'\r\n'+"Max Hosts number"+'\r\n'+maxHosts);


if(isHostAdress(firstHost,lastHost,ipTabBinary)){
    var answear = readline.question("Do you want to ping address");

    if(answear=="Y"){
        function puts(error, stdout, stderr) { sys.puts(stdout) }
        exec("ping "+ipDecimal, puts);
    }
}
}
