// process.env = require('./sample.env.js')(process.env.NODE_ENV || 'development');
// require('dotenv').config()
import express from "express";
import dotenv from "dotenv"
import indexRoutes from "./routes/index.js"

dotenv.config()

const port = process.env.PORT || 9000;
console.log("process.env.PORT", process.env.PORT)

import indexRoutes from './routes'

let indexRoutes = require('./routes/index.js');

const main = async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/', indexRoutes);
    app.use('*', (req, res) => res.status(404).send('404 Not Found'));
    app.listen(port, () =>
        console.log(`App now running and listening on port ${port}`)
    );
};
main();
