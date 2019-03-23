let getme = function() {

    return {

        h: 23,

        seth: function(param) {
            this.h = param;
        },

        geth: function() {
            return this.h;
        },

        printH: function(opt){
            let print = function(opt){
                console.log("H:"+opt.g);
            };
            print({
                g: this.h
            });
        }
        
    }
};

let jsonData = function(key, value) {
    let data = {};
    data[key] = value;
    return {
        add: function(k, v) {
        data[k] = v;
        return this;
        },

        build: function() {
        return data;
        }
    };
};

  let arr = [3, 4, 5];

  let data = jsonData(1, 2)
    .add("hi", "there")
    .add(arr[2], "man")
    .build();

let onlineUsers = [{name: 'mezi'}, {name:'villager'}];

let isUserUnique = function(name) {
    for(let i = 0; i < onlineUsers.length; i++) {
        if(onlineUsers[i].name === name) {
        return false;
        }
    }
    return true;
};    


let myobj = {
    callme: function() {
        console.log("Hello there");
    },
    callit: function() {
        let self = this;
        let cll = function(fn) {
            self[fn]();
        };
        cll('callme');
    }
}

let me = {
    name: "mezi"
};
let yo = {};
for(att in me) {
    yo[att] = me[att];
}
console.log(JSON.stringify(yo));
// myobj.callit();
// console.log(isUserUnique('mezi'));