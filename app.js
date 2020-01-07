'use strict'

const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', build)))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', index.html))
    })
}

const PORT = config.get('port') || 5000

async function start() {
    try {
        let mongoUri = 'mongodb+srv://ninja:1234d@cluster0-ccye3.azure.mongodb.net/test?retryWrites=true&w=majority'//config.get('mongoUri')
        console.log('mongo uri', mongoUri)

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            //useUnifiedTopology: true,
            useCreateIndex: true,
            reconnectTries: 100,
            reconnectInterval: 500,
            autoReconnect: true,
            dbName: 'test'
        }) .catch(err => console.log('Mongo connection error: ', err));
    } catch (e) {
        console.error('Server error:', e);
        process.exit(1)
    }
}

start()

app.listen(PORT, () => console.log(`app has been started on port ${PORT}...`))