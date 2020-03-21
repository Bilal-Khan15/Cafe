const express = require('express')
const bodyParser = require('body-parser')
const user = require('../models/user.js')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let insert = require('../db-functions/insert')

/**
 * @api {post} /invite invite
 * @apiName invite
 * @apiGroup Institute 
 *
 * @apiParam {String} email
 * @apiParam {String} institute_id
 *
 * @apiSuccess {Object} result
 * 
 */
app.post('/invite', (req, res) => {
    insert.invite(req.body.email, req.body.institute_id)

    res.send({
        result: req.body
    })
})


/**
 * @api {get} /open_invite open invite
 * @apiName open_invite
 * @apiGroup Institute  
 *
 * @apiParam {String} iv part of decrypt
 * @apiParam {String} id part of decrypt
 * @apiParam {String} email user email
 *
 * @apiSuccess {Object} result object of passed param
 */
app.get('/open_invite', async(req, res) => {
    email = await insert.open_invite(req.query.iv, req.query.id)
    
    req.query.email = email

    res.send({
        result: req.query
    })
})

/**
 * @api {post} /save_invite save invite
 * @apiName save_invite
 * @apiGroup Institute  
 *
 * @apiParam {String} email
 * @apiParam {String} pwd
 * @apiParam {String} iv
 * @apiParam {String} id
 *
 * @apiSuccess {Object} result
 * 
 */
app.post('/save_invite', (req, res) => {
    insert.save_invite(req.body.email, req.body.pwd, req.body.iv, req.body.id)

    res.send({
        result: req.body
    })
})

/**
 * @api {get} /institutes institutes
 * @apiName institutes
 * @apiGroup Institute 
 *
 * @apiSuccess {String[]} resources array of institutes
 */
app.get('/institutes', (req, res) => {
    user.db.collection('institutes').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    })
})

/**
 * @api {post} /inst_signup inst signup for parents
 * @apiName inst_signup
 * @apiGroup Institute 
 *  
 * @apiParam {String} type 
 * @apiParam {String} name
 * @apiParam {Number} nic 
 * @apiParam {String} address
 * @apiParam {Number} phone 
 * @apiParam {String} email 
 * @apiParam {String} date 
 * @apiParam {String} month 
 * @apiParam {String} year 
 * @apiParam {String} id 
 * @apiSuccess {Object} result
 */

/**
 * @api {post} /inst_signup inst signup for teacher
 * @apiName inst_signup
 * @apiGroup Institute 
 *  
 * @apiParam {String} type 
 * @apiParam {String} name
 * @apiParam {Number} nic 
 * @apiParam {String} address 
 * @apiParam {Number} phone 
 * @apiParam {String} email 
 * @apiParam {String} date 
 * @apiParam {String} month 
 * @apiParam {String} year 
 * @apiParam {String} id 
 * @apiParam {String} qualification 
 * @apiSuccess {Object} result
 */ 

/**
 * @api {post} /inst_signup inst signup for student
 * @apiName inst_signup
 * @apiGroup Institute 
 *  
 * @apiParam {String} type 
 * @apiParam {String} name
 * @apiParam {String} guardian_name 
 * @apiParam {Number} guardian_phone 
 * @apiParam {Number} student_phone 
 * @apiParam {String} address 
 * @apiParam {String} guardian_email 
 * @apiParam {Number} guardian_nic 
 * @apiParam {String} date 
 * @apiParam {String} month 
 * @apiParam {String} year 
 * @apiParam {String} student_email 
 * @apiParam {String} id 
 * @apiSuccess {Object} result
 */

app.post('/inst_signup', (req, res) => {
    if (req.body.type == 'parent') {
        insert.inst_signupParent(req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id)
        res.send({
            result: req.body
        })
    }
    if (req.body.type == 'teacher') {
        insert.inst_signupTeacher(req.body.date_of_joining, req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id, req.body.qualification)
        res.send({
            result: req.body
        })
    }
    if (req.body.type == 'student') {
        insert.inst_signupStudent(req.body.student_nic, req.body.date_of_joining, req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.guardian_name, req.body.guardian_phone, req.body.student_phone, req.body.address, req.body.guardian_email, req.body.guardian_nic, req.body.date, req.body.month, req.body.year, req.body.student_email, req.body.id)
        res.send({
            result: req.body
        })
    }
})

/**
 * @api {get} /inst_students inst students
 * @apiName inst_students
 * @apiGroup Institute 
 *
 * @apiSuccess {String[]} resources array of institute students
 */
app.get('/inst_students', (req, res) => {
    user.db.collection('institute_students').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

/**
 * @api {get} /inst_teachers inst teachers
 * @apiName inst_teachers
 * @apiGroup Institute 
 * 
 * @apiSuccess {String[]} resources array of institute teachers
 */
app.get('/inst_teachers', (req, res) => {
    user.db.collection('institute_teachers').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

/**
 * @api {post} /update_inst_student update inst student
 * @apiName update_inst_student
 * @apiGroup Institute  
 *
 * @apiParam {String} id 
 * @apiParam {String} date_of_joining 
 * @apiParam {String} institute_id
 * @apiParam {String} institute_name 
 * @apiParam {String} type 
 * @apiParam {String} name 
 * @apiParam {String} guardian_name 
 * @apiParam {String} guardian_email 
 * @apiParam {Number} guardian_phone 
 * @apiParam {Number} student_phone 
 * @apiParam {String} address 
 * @apiParam {String} guardian_email 
 * @apiParam {Number} student_nic 
 * @apiParam {Number} guardian_nic 
 * @apiParam {String} date 
 * @apiParam {String} month 
 * @apiParam {String} year 
 * @apiParam {String} student_email 
 * @apiSuccess {String} result
 * 
 */
app.post('/update_inst_student', (req, res) => {
    user.db.collection('institute_students').doc(req.body.id).get().then((res) => {
        let data = res.data()
        console.log(data)
        if (req.body.date_of_joining) {
            data.date_of_joining = req.body.date_of_joining
        }
        if (req.body.institute_id) {
            data.institute_id = req.body.institute_id
        }
        if (req.body.institute_name) {
            data.institute_name = req.body.institute_name
        }
        if (req.body.type) {
            data.type = req.body.type
        }
        if (req.body.name) {
            data.name = req.body.name
        }
        if (req.body.guardian_name) {
            data.guardian_name = req.body.guardian_name
        }
        else if (req.body.guardian_phone) {
            data.guardian_phone = req.body.guardian_phone
        }
        if (req.body.student_phone) {
            data.student_phone = req.body.student_phone
        }
        if (req.body.address) {
            data.address = req.body.address
        }
        if (req.body.guardian_email) {
            data.guardian_email = req.body.guardian_email
        }
        if (req.body.student_nic) {
            data.student_nic = req.body.student_nic
        }
        if (req.body.guardian_nic) {
            data.guardian_nic = req.body.guardian_nic
        }
        if (req.body.date) {
            data.date = req.body.date
        }
        if (req.body.month) {
            data.month = req.body.month
        }
        if (req.body.year) {
            data.year = req.body.year
        }
        if (req.body.student_email) {
            data.student_email = req.body.student_email
        }

        user.db.collection('institute_students').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted institute student has been Updated.'
    })
})

/**
 * @api {post} /update_inst_teacher update inst teacher
 * @apiName update_inst_teacher
 * @apiGroup Institute  
 *
 * @apiParam {String} id 
 * @apiParam {String} date_of_joining 
 * @apiParam {String} institute_id 
 * @apiParam {String} institute_name 
 * @apiParam {String} type 
 * @apiParam {String} name 
 * @apiParam {Number} nic 
 * @apiParam {String} address 
 * @apiParam {Number} phone 
 * @apiParam {String} email 
 * @apiParam {String} date 
 * @apiParam {String} month 
 * @apiParam {String} year 
 * @apiParam {String} resources 
 * @apiParam {String} qualification 
 *
 * @apiSuccess {String[]} result array of announcements 
 * 
 */
app.post('/update_inst_teacher', (req, res) => {
    user.db.collection('institute_teachers').doc(req.body.id).get().then((res) => {
        let data = res.data()
        console.log(data)
        if (req.body.date_of_joining) {
            data.date_of_joining = req.body.date_of_joining
        }
        if (req.body.institute_id) {
            data.institute_id = req.body.institute_id
        }
        if (req.body.institute_name) {
            data.institute_name = req.body.institute_name
        }
        if (req.body.type) {
            data.type = req.body.type
        }
        if (req.body.name) {
            data.name = req.body.name
        }
        if (req.body.nic) {
            data.nic = req.body.nic
        }
        else if (req.body.address) {
            data.address = req.body.address
        }
        if (req.body.phone) {
            data.phone = req.body.phone
        }
        if (req.body.email) {
            data.email = req.body.email
        }
        if (req.body.date) {
            data.date = req.body.date
        }
        if (req.body.month) {
            data.month = req.body.month
        }
        if (req.body.year) {
            data.year = req.body.year
        }
        if (req.body.resources) {
            data.resources = req.body.resources
        }
        if (req.body.qualification) {
            data.qualification = req.body.qualification
        }

        user.db.collection('institute_teachers').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted institute teacher has been Updated.'
    })
})

/**
 * @api {post} /remove_inst_student remove inst student
 * @apiName remove_inst_student
 * @apiGroup Institute  
 *
 * @apiParam {String} id Users unique ID.
 *
 * @apiSuccess {String} result
 * 
 */
app.post('/remove_inst_student', (req, res) => {
    user.db.collection('institute_students').doc(req.body.id).get().then((res) => {
        let data = res.data()

        data.is_archive = true

        user.db.collection('institute_students').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted student has been deleted.'
    })
})

/**
 * @api {post} /remove_inst_teacher remove inst teacher
 * @apiName remove_inst_teacher
 * @apiGroup Institute  
 *
 * @apiParam {String} id Users unique ID.
 *
 * @apiSuccess {String} result
 * 
 */
app.post('/remove_inst_teacher', (req, res) => {
    user.db.collection('institute_teachers').doc(req.body.id).get().then((res) => {
        let data = res.data()

        data.is_archive = true

        user.db.collection('institute_teachers').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted teacher has been deleted.'
    })
})

module.exports = app;