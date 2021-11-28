import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import config from "../config/config";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";

class AuthController {
  static login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res
        .status(400)
        .json({ messaje: " USERNAME && PASSWORD  REQUERIDO" });
    }
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (err) {
      return res
        .status(400)
        .json({ messaje: " USERNAME && PASSWORD INCORRECTO " });
    }

    ////check password
    if (!user.checkPassword(password)) {
      return res
        .status(400)
        .json({ messaje: "USUARIO O CONTRASEÑA INCORRECTO" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ messaje: "OK", token });
  };

  static changePassword=async(req: Request, res: Response)=>{
    const {userId}=res.locals.jwtpayload;
    const {oldPassword,newPassword}=req.body;

    if(!(oldPassword && newPassword)){
        res.status(400).json({message:"VERIFIQUE PASSWORD NUEVA Y ANTIGUA"});
    }
    const userRepository=getRepository(User);
    let user:User;
    try{
        user=await userRepository.findOneOrFail(userId);
    }catch(e){
        res.status(400).json({ message:"ALGUN CAMPO ESTA INCORRECTO"});
    }
    if(!user.checkPassword(oldPassword)){
        return res.status(401).json({message:"REVISA TU CONTRASEÑA ANTIGUA"});

    }
    user.password=newPassword;
    const validationOps={validationError:{target:false,value:false}}
    const errors =await validate (user,validationOps);

    if(errors.length>0){
        return res.status(400).json(errors);
    }
    /////////////hash
    user.hashPassword();
    userRepository.save(user);
    res.json({message:"PASSWORD CAMBIADA CORRECTAMENTE "})

  }

}

export default AuthController;
