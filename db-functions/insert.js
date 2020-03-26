const user = require('../models/user.js')
var validator = require('validator');
let admin = require('firebase-admin');
    
const addorder = (user_id, items_id, items_quantity, customize, date, month, year) => {
    // currentTime = 08/21/2021
    currentTime = month + '/' + date + '/' + year;
    const cdate = new Date(currentTime);
    var timestamp = cdate.getTime()
    
    return new Promise((resolve, reject) => {
        try{
            user.db.collection('order').add({
                user_id, 
                items_id, 
                items_quantity, 
                customize, 
                date, 
                month, 
                year,
                timestamp,
                status: 'Active'
            })
            .then((doc)=>{
                user.db.collection('order').doc(doc.id).set({id: doc.id}, {merge: true})
                .then(() => resolve())
                .catch((e)=>console.log(e))
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}
    
const additem = (name, price, ingredients) => {
    return new Promise((resolve, reject) => {
        try{
            user.db.collection('item').add({
                name, 
                price, 
                ingredients
            })
            .then((doc)=>{
                user.db.collection('item').doc(doc.id).set({id: doc.id}, {merge: true})
                .then(() => resolve())
                .catch((e)=>console.log(e))
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}

const signupEmployee = (type, UserName, Email, Password, CompanyName, CompanyId) => {
    return new Promise((resolve, reject) => {
        try{
            user.db.collection('user').add({
                type: 'employee', 
                UserName, 
                Email, 
                Password, 
                CompanyName, 
                CompanyId
            })
            .then((doc)=>{
                user.db.collection('user').doc(doc.id).set({id: doc.id}, {merge: true})
                .then(() => resolve())
                .catch((e)=>console.log(e))
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}

const signupManage = (type, UserName, Password) => {
    return new Promise((resolve, reject) => {
        try{
            user.db.collection('user').add({
                type, 
                UserName, 
                Password
            })
            .then((doc)=>{
                user.db.collection('user').doc(doc.id).set({id: doc.id}, {merge: true})
                .then(() => resolve())
                .catch((e)=>console.log(e))
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}

module.exports = {
    additem: additem,
    signupEmployee: signupEmployee,
    signupManage: signupManage,
    addorder: addorder,
}