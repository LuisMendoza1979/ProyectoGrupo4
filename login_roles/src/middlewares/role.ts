import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = res.locals.jwtpayload;
    const userRepository = getRepository(User);
    let user :User;

    try{
        user=await userRepository.findOneOrFail(userId);
    }catch(err){
     return res.status(401).send();   
    }


    /////checkRole
    const {tipo_user}=user;
    if(roles.includes(tipo_user)){
        next();
    }else{
        res.status(401).json({message: "not authorize"});
        
    }

};
};
