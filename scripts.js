const { currentuser } = require("./server");

var user = function(){
    console.log('uh')
    return currentuser;
};

document.getElementById('testing').value = user();
