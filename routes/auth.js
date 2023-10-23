var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// connect to database
try {
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
} catch (err) {
    console.log('Cannot connect to database'); 
}

// create user schema 
const schema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

// create user model
const user = mongoose.model('user', schema); 

router.get('/create', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // check for duplicate username
    let duplicate = user.find({
        username: username
    });

    if (duplicate) {
        res.json({
            "error": "username already exists"
        });
    } else {
        var newUser = new user({
            username: username,
            password: password
        });
    
        newUser.save((err, data) => {
            if (err) return console.log('Cannot save user'); 
            res.json({
                "status": "success",
                "username": data.username,
                "password": data.password
            });
        })
    }
}); 

router.get('/user/:name', (req, res) => {
    let username = req.params.name;

    user.findOne({username: username}, (err, data) => {
        if (err || data === null) return res.json("Error")
        
        return res.json({
            username: data.username,
            password: data.password
        }); 
    })

})

module.exports = router; 