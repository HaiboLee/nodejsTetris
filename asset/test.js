var jj = {};

var arr = ['x','y','z'];
for(var i = 0;i<arr.length;i++){
    jj[i] = arr[i];
}

jj.xx = 'xxx';

console.log(jj);
//for (var x in jj){
//    console.log(x);
//}

console.log(jj[3]);
