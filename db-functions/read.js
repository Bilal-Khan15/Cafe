const user = require('../models/user.js')

const signinAll = (UserName, Password) => {
    try{
        return new Promise((resolve,reject)=>{
            user.db.collection('user').where('UserName', '==', UserName).get()
                .then((res) => {
                    let userData = res.data();
                    resolve(userData)
                })
                .catch((e) => {
                    const mess = e.message
                    reject({ message: mess })
                })
            }) 
    }  catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

module.exports = {
    signinAll: signinAll
}