import { Console } from "console";
import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import config from "../config/config";


export const checkJWT=(req: Request, res: Response ,next:NextFunction)=>{
    ///console.log("req->",req.headers['auth']);

    const token =<string>req.headers['auth'];
    let jwtpayload;

    try{
        jwtpayload =<any>jwt.verify(token,config.jwtSecret);
        res.locals.jwtpayload=jwtpayload;
    }catch(err){
        return res.status(401).json({message:'NO AUTHORIZED'});
    }
    const {userId, username} =jwtpayload;
    const newToken =jwt.sign({userId, username},config.jwtSecret,{expiresIn:'1h'});///expiracion del token ////
    res.setHeader('token',newToken);
    ////////llamar next
    next();
}

