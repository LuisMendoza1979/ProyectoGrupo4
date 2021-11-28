import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";
import { stat } from "fs";

export class UserController {

  ////metodo GETALL
  static getAll = async (req: Request, res: Response) => {
    let users;
    const userRepository = getRepository(User);
    try{
       users = await userRepository.find();
    }catch(e){
      res.status(404).json({message: 'error en los resultados'})
    }
  
   
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).json({ message: "sin resultados" });
    }
  };

  ////metodo de GET
  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id);
      res.send(user);
    } catch (err) {
      res.status(404).json({ message: "sin resultados de buqueda" });
    }
  };

  ////metodo de POST NEWUSER
  static newUser = async (req: Request, res: Response) => {
    const { username, email, password, tipo_user, estado } = req.body;
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.tipo_user = tipo_user;
    user.estado = estado;

    /////// validate
    const errors = await validate(user, {validationError: {target:false, value: false }});
    if (errors.length > 0) {
      return res.status(400).json(errors);
    } ////////HASH PASSWORD
    const userRepository = getRepository(User);
    try {
      user.hashPassword();
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).json({ message: "ERROR USUARIO YA EXISTE" });
    }
    ///ALL
    res.send("USER CREATED ");
  };

  ///////EDITAR PATCH
  static editUser = async (req: Request, res: Response) => {
    let user;
    const { id } = req.params;
    const { username, email, tipo_user, estado } = req.body;
    const userRepository = getRepository(User);
    ////try get userRepository(User)
    try {
      user = await userRepository.findOneOrFail(id); /////trata de encontar usuario
      //////si encontro el usuario que lo guarde en esta variables
      user.username = username;
      user.email = email;
      user.tipo_user = tipo_user;
      user.estado = estado;
    } catch (e) {
      return res.status(404).json({ message: "usuario no existe" }); /////si no encrutra usuario
    } //////si encuentra errores
    const errors = await validate(user, {validationError: {target:false, value: false } });
    ////console.log(errors);
    if (errors.length > 0) {
      return res.status(404).json(errors);
    }
    /////////try to save
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).json({ message: "nombre de usuario ya existe" });
    }
    res.status(201).json({ message: "usuario actulizado" });
  };

  ////////DELETE
  static deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: "ERROR USUARIO NO EXISTE " });
    }

    ///////REMOVE USER_
    userRepository.delete(id);
    res.status(201).json({ message: "USUARIO ELIMINADO" });
  };
} /////FIN CLASE USER CONTROLLER

export default UserController;
