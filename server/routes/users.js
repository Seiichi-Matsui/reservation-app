const express = require('express')
const router = express.Router()
const User = require('../model/user')
const jwt = require('jsonwebtoken');
const config = require('../config/')


router.post('/login', function(req, res) {
    const { email, password } = req.body
    if(!email) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'please fill email!'}]})
    }

    if(!password) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'please fill password!'}]})
    }

    User.findOne({email}, function(err, foundUser) {
        if(err) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'Someting went wrong!'}]})
        }
        if(!foundUser) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'User is not exist!'}]})
        }
        if(foundUser.hasSamePassword(password)) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'Incorrect password!'}]})
        }

        const token = jwt.sign({
            userId: foundUser.id,
            username: foundUser.username
          }, config.SECRET, { expiresIn: '1h' });

        return res.json(token)
    })

})

router.post('/register', function(req, res) {
    const{ username, email, password, confirmPassword } = req.body

    // 下を一行で書くと上になる
    // const username = req.body.username
    // const email = req.body.email
    // const password = req.body.password
    // const confirmPassword = req.body.confirmPassword

    if(!username) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'please fill username!'}]})
    }

    if(!email) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'please fill email!'}]})
    }

    if(!password) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'please fill password!'}]})
    }

    if(password !== confirmPassword) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'please check password!'}]})
    }


    User.findOne({email}, function(err, foundUser) {
        if(err) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'Someting went wrong!'}]})
        }
        if(foundUser) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'User alredy exist!'}]})
        }

        const user = new User({username, email, password})
        user.save(function(err) {
            if(err) {
                return res.status(422).send({errors: [{title: 'User error', detail: 'Someting went wrong!'}]})
            }
            return res.json({"registerd": true})
        })

    })

    // product.findById(productId, function(err, foundProduct) {
    //     if(err) {
    //         return res.status(422).send({errors: [{title: 'Product error', detail: 'Product not found!'}]})
    //     }
    // })

})

module.exports = router