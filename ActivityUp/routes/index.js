var express = require('express');
var router = express.Router();
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://test123:test123@clusteractivity.oqe3k.mongodb.net/LoginDB?retryWrites=true";
const assert = require('assert');
var objectId = require('mongodb').ObjectID;
var id = require('mongodb').id;
const { stringify } = require('querystring');
const { count } = require('console');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/home')
});

router.get('/Dashboard', enSureAuthencated, authRole('Student'), async function(req, res, next) {
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('LoginDB').collection('data').findOne({});
    console.log(users)
    res.render('Dashboard', { 'data': users });
});
/////////////////////////////////////////////////////////////
router.get('/DashboardProfile', enSureAuthencated, authRole('Student'), async function(req, res, next) {
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('LoginDB').collection('data').findOne({});
    console.log(users)
    res.render('DashboardProfile', { 'data': users });
});
/////////////////////////////////////////////////////////////
router.get('/Dashboardview', enSureAuthencated, authRole('Student'), async function(req, res, next) {
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('LoginDB').collection('data').findOne({});
    console.log(users)
    res.render('Dashboardview', { 'data': users });
});
/////////////////////////////////////////////////////////////





//admin
router.get("/Dashboardadmin", authRole('admin'), async function(req, res) {
        const client = new MongoClient(uri);
        await client.connect();
        const users = await client.db('LoginDB').collection('data').find({}).toArray();
        await client.close()
        console.log(users)
        res.render("Dashboardadmin", { 'data': users });
    })
    /////////////////////////////////////////////////////////////////
    // router.get ( "/EditDashboardadmin",async function ( req, res )  {
    //     const client = new MongoClient(uri);
    //     await client.connect();
    //     const users = await client.db('LoginDB').collection('data').find({}).toArray();
    //     await client.close()
    //     console.log(users)
    //     res.render ( "EditDashboardadmin",{'data':users} );
    // })
    ////////////////////insert///////////////////////////////////
router.post('/insert', async function(req, res, next) {
    const client = new MongoClient(uri);
    const diffTime = new Date(req.body.endTime).getTime() - new Date(req.body.startTime).getTime()
    if (diffTime < 0) return res.redirect('/insert');
    await client.connect();
    await client.db('LoginDB').collection('data').insertOne({
        No: Date.now(),
        ActivityName: req.body.ActivityName,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        place: req.body.place,
        score: Math.floor(diffTime / 3600000),
        count: 0
    });
    await client.close();
    res.redirect('/Dashboardadmin');
});
//////////////////////Get////////////////////////////////
router.get('/update/:id', async function(req, res, next) {
    const id = parseInt(req.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('LoginDB').collection('data').findOne({ "No": id });
    await client.close()
    console.log(users)
    res.render('update', { 'data': users })
});

////////////////////update/////////////////////////////
router.post('/update/:id', async(req, res) => {
        const id = parseInt(req.params.id);
        const client = new MongoClient(uri);
        const diffTime = new Date(req.body.endTime).getTime() - new Date(req.body.startTime).getTime()
        if (diffTime < 0) return res.json({ status: 'failed' })
        await client.connect();
        await client.db('LoginDB').collection('data').updateOne({ 'No': id }, {
            "$set": {
                ActivityName: req.body.ActivityName,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                place: req.body.place,
                score: Math.floor(diffTime / 3600000),
            }
        });
        await client.close();
        res.redirect('/Dashboardadmin');
    })
    ///////////////////Delete////////////////////////////
router.post('/delete/:id', async(req, res) => {
        const id = parseInt(req.params.id);
        const client = new MongoClient(uri);
        await client.connect();
        await client.db('LoginDB').collection('data').deleteOne({ 'No': id });
        await client.close();
        res.redirect('/Dashboardadmin');
    })
    ////////////////////////////////////////////////////

router.get("/insert", function(req, res) {
    res.render("insert");
})

router.get('/home', function(req, res, next) {
    res.render('home');
});
router.get("/home/WeingBour", function(req, res) {
    res.render("WeingBour");
})
router.get("/home/WeingChiangRang", function(req, res) {
    res.render("WeingChiangRang");
})
router.get("/home/WeingJomTong", function(req, res) {
    res.render("WeingJomTong");
})
router.get("/home/WeingKaluang", function(req, res) {
    res.render("WeingKaluang");
})
router.get("/home/WeingLor", function(req, res) {
    res.render("WeingLor");
})
router.get("/home/WeingNamTao", function(req, res) {
    res.render("WeingNamTao");
})

function enSureAuthencated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401)
            return res.send('Not allowed')
        }
        next()
    }
}

module.exports = router;