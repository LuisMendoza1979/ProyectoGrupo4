import { Router } from "express";
import AuthController from "../controller/AuthController";
import { checkJWT } from "./../middlewares/jwt";

const router=Router();
///login
router.post('/login',AuthController.login);


///////cambio de contraseña 
router.post('/change-password',[checkJWT],AuthController.changePassword)


export default router;



