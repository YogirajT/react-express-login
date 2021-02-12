const express = require('express');
const bodyParser = require('body-parser');
const env = require('./env');
const Sequelize = require("sequelize");
const InitUser = require('./models');
const passportSetup = require('./passport-setup');
const passport = require('passport');
const publicRoutes = require('./routes/public');
const privateRoutes = require('./routes/private');
const cors = require('cors');

let server;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('images'))
app.use(cors({
    "origin": `http://localhost:3001`,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials": true
}));


app.use(passport.initialize());
const sequelize = new Sequelize(env.db.database, env.db.user, env.db.password, {
    host: env.db.host,
    dialect: 'mysql'
});

const User = InitUser(sequelize);

User.sync().then(() => {
    passportSetup(passport, User);

    app.use('/', publicRoutes);

    app.use('/user', passport.authenticate('jwt', { session: false }), privateRoutes);

    app.use((req, res) => {
        res.status(500).json({ error: err });
    });
    
    server = app.listen(env.port, async (err) => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        if (!err)
            console.log("Site is live");
        else console.log(err)
    });
    
});

process.on('SIGTERM', () => {
    if(server) {
        server.close(() => {
            console.log('Process terminated')
        });
    }
});

process.on('uncaughtException', (err) => {
    process.stdout.write(`Fatal:  ${JSON.stringify(err)}`, () => {
        process.kill(process.pid, 'SIGTERM')
    })
});