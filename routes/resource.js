const express = require('express')
const bodyParser = require('body-parser')
const user = require('../models/user.js')
const fs = require('fs')
var validator = require('validator');
var multipart = require('connect-multiparty');

const app = require('express').Router();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var multipartMiddleware = multipart();

let router = express.Router(),
    insert = require('../db-functions/insert'),
    read = require('../db-functions/read');

app.get('/orders', (req, res) => {
    user.db.collection('order').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        res.send({
            resources: data
        })
    });
})

app.post('/myorder', (req, res) => {
    user.db.collection('order').where('user_id', '==', req.body.user_id).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        res.send({
            resources: data
        })
    });
})

app.post('/addorder', (req, res) => {
    insert.addorder(req.body.user_id, req.body.items_id, req.body.items_quantity, req.body.customize, req.body.date, req.body.month, req.body.year)

    res.send({
        result: 'Order has been added.'
    })
})

app.post('/updateorder', (req, res) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var ccurrentTime = mm + '/' + dd + '/' + yyyy;
    var cdate = new Date(ccurrentTime);
    var ctimestamp = cdate.getTime()
    
    user.db.collection('order').doc(req.body.id).get()
    .then( async (resp)=>{
        let data = resp.data()
        if(ctimestamp < data.timestamp)
        {
            if (req.body.items_id) {
                data.items_id = req.body.items_id
            }
            if (req.body.items_quantity) {
                data.items_quantity = req.body.items_quantity
            }
            if (req.body.customize) {
                data.customize = req.body.customize
            }
            if ((req.body.date)&&(req.body.month)&&(req.body.year)) {
                data.date = req.body.date
                data.month = req.body.month
                data.year = req.body.year
    
                // currentTime = 08/21/2021
                var currentTime = data.month + '/' + data.date + '/' + data.year;
                var date = new Date(currentTime);
                var timestamp = date.getTime()
    
                data.timestamp = timestamp
            }
    
            let deleteDoc = await user.db.collection('order').doc(req.body.id).set(data)
    
            console.log("Order updated ! ")
    
            res.send({
                result: data
            })
        }
        else{
            res.send({
                resources: "Order updation FAILED !"
            })        
        }
    })
    .catch((e) => console.log(e))
})

app.post('/deleteorder', async (req, res) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    currentTime = mm + '/' + dd + '/' + yyyy;
    const date = new Date(currentTime);
    var timestamp = date.getTime()

    user.db.collection('order').doc(req.body.id).get()
    .then( async (resp)=>{
        let userData = resp.data()
        if(timestamp < userData.timestamp)
        {
            let deleteDoc = await user.db.collection('order').doc(req.body.id).get().then((res) => {
                let data = res.data()
        
                data.status = "Cancelled"
        
                user.db.collection('order').doc(req.body.id).set(data)
            })
        
            res.send({
                result: 'Targeted order has been deleted.'
            })
        }
        else{
            res.send({
                resources: "Order cancellation FAILED !"
            })        
        }
    })
    .catch((e) => console.log(e))
})

app.get('/menu', (req, res) => {
    user.db.collection('item').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        res.send({
            resources: data
        })
    });
})

app.post('/additem', (req, res) => {
    insert.additem(req.body.name, req.body.price, req.body.ingredients)

    res.send({
        result: 'Item has been added.'
    })
})

app.post('/deleteitem', async (req, res) => {
    let deleteDoc = await user.db.collection('item').doc(req.body.id).delete();

    res.send({
        result: deleteDoc
    })
})
    
module.exports = app;