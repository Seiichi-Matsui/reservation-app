const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/')
const FakeDb = require('./fake-db')
const bodyParser = require('body-parser')

const productRoutes = require('./routes/products')
const UserRoutes = require('./routes/users')
const path = require('path')

mongoose.connect(config.DB_URI).then(
    () => {
        if(process.env.NODE_ENV !== 'production') {
            const fakeDb = new FakeDb()
            // fakeDb.initDb()
        }
    }
)

const app = express()
app.use(bodyParser.json())

app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', UserRoutes)

if(process.env.NODE_ENV === 'production') {
    const appPath = path.join( __dirname, '..', 'dist', 'reservation-app')
    app.use(express.static(appPath))
    app.get('*', function(req, res) {
        res.sendFile(path.resolve(appPath, 'index.html'))
})


}

const PORT = process.env.PORT || '3001'

app.listen(PORT, function() {
    console.log('I am running!');
})