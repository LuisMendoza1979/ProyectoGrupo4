import { checkRole } from "../middlewares/role";
import { checkJWT } from "../middlewares/jwt";
import { UserController } from "./../controller/UserController";
import { Router } from "express";



const router =Router();

/////GETT AL USER ,[checkJWT,checkRole(['ADMIN'])]
router.get('/' ,UserController.getAll);

///get one user
router.get('/:id' ,UserController.getById);


////create a new user
router.post('/' ,UserController.newUser);


////EDITAR
router.patch('/:id' ,UserController.editUser);

////eliminar
router.delete('/:id',UserController.deleteUser);


////////////////////////////////
export default router;
