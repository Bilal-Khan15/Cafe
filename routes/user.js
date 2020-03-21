const express = require('express')
const bodyParser = require('body-parser')
const user = require('../models/user.js')
const fs = require('fs')
var validator = require('validator');
var multipart = require('connect-multiparty');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var multipartMiddleware = multipart();

let router = express.Router(),
    insert = require('../db-functions/insert'),
    read = require('../db-functions/read');

app.post('/signup', (req, res) => {
    if (req.body.type == 'employee') {
        insert.signupEmployee(req.body.type, req.body.UserName, req.body.Email, req.body.Password, req.body.CompanyName, req.body.CompanyId)
        res.send({
            result: req.body
        })
    }
    if ((req.body.type == 'caterer') || (req.body.type == 'admin')) {
        insert.signupManage(req.body.type, req.body.UserName, req.body.Password)
        res.send({
            result: req.body
        })
    }
})

app.post('/signin', async (req, res) => {
    user.db.collection('user').where('UserName', '==', req.body.UserName).where('Password', '==', req.body.Password).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });
        
        res.send({
            resources: data
        })
    });
})

app.get('*', (req, res) => {
    console.log('route not found')
    res.status(404).send({
        title: '404',
        name: 'Bilal Khan',
        error: 'Page not found.'
    })
})

module.exports = app;