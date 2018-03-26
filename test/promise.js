let callback = function(func) {
    setTimeout(()=>{
        func('OK');
    }, 5000);
}

let User = {
    findOne: (query) => {
        return new Promise((resolve, reject) => {
            callback(resolve);
        })
    }
}

let user = User.findOne(112);
console.log(user);
user.then(console.log)