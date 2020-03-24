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

app.post('/addResource', async (req, res) => {
    if((req.body.title.trim() == '') || (!validator.isLength(req.body.title, min= 1, max= 60))  
        || (req.body.description.trim() == '') || (!validator.isLength(req.body.description, min= 0, max= 1000)) 
        || (req.body.grade.trim() == '') 
        || (req.body.subject.trim() == '') 
        || (req.body.teacher_id.trim() == '') 
        || (req.body.author.trim() == '') || (!validator.isLength(req.body.author, min= 2, max= undefined))){
            return res.status(404).send({ error: 'Please fill all the fields properly !' })
        }

        ret = await insert.addResource(req.body.title, req.body.description, req.body.grade, req.body.subject, req.body.teacher_id, req.body.author, req.body.file, req.body.video_url, req.body.tags)

        req.body.time = ret[0]
        req.body.is_archive = ret[1]
        req.body.id = ret[2]
    
        res.send({
            result: req.body
        })
})

app.post('/removeResource', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()

        data.is_archive = true

        user.db.collection('resources').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted resource has been deleted.'
    })
})

app.post('/updateResource', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()
        console.log(data)
        if (req.body.title) {
            data.title = req.body.title
        }
        if (req.body.description) {
            data.description = req.body.description
        }
        if (req.body.grade) {
            data.grade = req.body.grade
        }
        if (req.body.subject) {
            data.subject = req.body.subject
        }
        if (req.body.teacher_id) {
            data.teacher_id = req.body.teacher_id
        }
        if (req.body.file) {
            data.file = req.body.file
            data.video_url = ''
        }
        else if (req.body.video_url) {
            data.video_url = req.body.video_url
            data.file = ''
        }
        if (req.body.author) {
            data.author = req.body.author
        }
        if (req.body.time) {
            data.time = req.body.time
        }
        if (req.body.is_archive) {
            data.is_archive = req.body.is_archive
        }

        user.db.collection('resources').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted resource has been Updated.'
    })
})

function getdate(day)
{
    if(day == 'yesterday') { diffDays = 1 } 
    else if(day == 'last_week') { diffDays = 7 } 
    else if(day == 'last_month') { diffDays = 31 } 
    else { return 0 }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    currentTime = mm + '/' + dd + '/' + yyyy;
    const date2 = new Date(currentTime);

    const diffTime = diffDays * (1000 * 60 * 60 * 24);
    date1 = Math.abs(date2.getTime() - diffTime)
    return date1 
}

app.post('/library/filter', (req, res) => {
    console.log(req.body.subject)
    var time = getdate(req.body.time)
    user.db.collection('resources').where('time', '>=', time).get().then(async (snapshot) => {
        let data = []
        await snapshot.docs.forEach(doc => {
            let chk = false
            if(req.body.subject != undefined){
                req.body.subject.forEach(sub => {
                    if ((!doc.data().is_archive) && (doc.data().subject.toLowerCase() == sub.label.toLowerCase())) {
                        data.push(doc.data())
                        chk = true
                    }
                });
            }

            if(req.body.grade != undefined){
                req.body.grade.forEach(sub => {
                    if ((!doc.data().is_archive) && (doc.data().grade.toLowerCase() == sub.label.toLowerCase()) && (!chk)) {
                        data.push(doc.data())
                        chk = true
                    }
                });
            }
        });

        if ((req.body.time != undefined) && (req.body.subject == undefined) && (req.body.subject == undefined))
        {
            snapshot.docs.forEach((doc) => {
                data.push(doc.data())
            });
        }

        res.send({
            resources: data
        })
    });
})

app.get('/library/myLibrary', (req, res) => {
    user.db.collection('resources').where('teacher_id', '==', req.query.id).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if (!doc.data().is_archive) {
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

app.post('/library/myLibrary/filter', (req, res) => {
    var time = getdate(req.body.time)
    user.db.collection('resources').where('teacher_id', '==', req.body.id).where('time', '>=', time).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            let chk = false
            if(req.body.subject != undefined){
                req.body.subject.forEach(sub => {
                    if ((!doc.data().is_archive) && (doc.data().subject.toLowerCase() == sub.label.toLowerCase())) {
                        data.push(doc.data())
                        chk = true
                    }
                });
            }

            if(req.body.grade != undefined){
                req.body.grade.forEach(sub => {
                    if ((!doc.data().is_archive) && (doc.data().grade.toLowerCase() == sub.label.toLowerCase()) && (!chk)) {
                        data.push(doc.data())
                        chk = true
                    }
                });
            }
        });

        if ((req.body.time != undefined) && (req.body.subject == undefined) && (req.body.subject == undefined))
        {
            snapshot.docs.forEach((doc) => {
                data.push(doc.data())
            });
        }

        res.send({
                resources: data
        })
    });
})

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

app.get('/tags', (req, res) => {
    user.db.collection('tags').doc('resources').get().then(snapshot => {
        let sdata = []
        let cdata = []
        snapshot.data().subject.forEach(tag => {
            sdata.push(tag);
        });

        snapshot.data().grade.forEach(tag => {
            cdata.push(tag);
        });

        //data = JSON.stringify(data)
        res.send({
            subject: sdata,
            grade: cdata
        })
    });
})

app.post('/views', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()

        data.views += 1

        user.db.collection('resources').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted resource has been viewed.'
    })
})

app.post('/helpful', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()
        let chk = false

        if(data.responsers){
            data.responsers.forEach(id => {
                if(id == req.body.sid){
                    chk = true
                }
            })
        }else{
            data.responsers = []
        }

        if(!chk)
        {
            data.helpful += 1
            data.responsers.push(req.body.sid)
    
            user.db.collection('resources').doc(req.body.id).set(data)
    
            user.db.collection('users').doc(req.body.sid).get().then((res) => {
                let sdata = res.data()
                sdata.helpful ? sdata.helpful = [...sdata.helpful, req.body.id] : sdata.helpful = [req.body.id]
                user.db.collection('users').doc(req.body.sid).set(sdata)
            })
        }
    })
    
    res.send({
        result: 'Targeted resource has been found helpful.'
    })
})

app.post('/nothelpful', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()
        let chk = false

        if(data.responsers){
            data.responsers.forEach(id => {
                if(id == req.body.sid){
                    chk = true
                }
            })
        }else{
            data.responsers = []
        }

        if(!chk)
        {
            data.nothelpful += 1
            data.responsers.push(req.body.sid)

            user.db.collection('resources').doc(req.body.id).set(data)

            user.db.collection('users').doc(req.body.sid).get().then((res) => {
                let sdata = res.data()
                sdata.nothelpful ? sdata.nothelpful = [...sdata.nothelpful, req.body.id] : sdata.nothelpful = [req.body.id]
                user.db.collection('users').doc(req.body.sid).set(sdata)
            })    
        }
    })

            
    res.send({
        result: 'Targeted resource has not been found helpful.'
    })
})
    
module.exports = app;