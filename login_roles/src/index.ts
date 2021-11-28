import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
//import * as bodyParser from "body-parser";
import {Request, Response} from "express";
//import {Routes} from "./routes";
//import {User} from "./entity/User";
import * as cors from "cors";
import * as helmet from "helmet";
const PORT =process.env.PORT || 3000;
import routes from "./routes";

createConnection().then(async () => {

    // create express app
    const app = express();
    ///middlewares
    app.use(cors());
    app.use(helmet());

    app.use(express.json());
    ////Routes
    app.use('/',routes);

    // setup express app here
    // ...

    // start express server
    app.listen(PORT,()=>console.log("server up in port 3000"));


}).catch(error => console.log(error));
