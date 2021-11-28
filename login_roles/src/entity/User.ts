import {Entity, PrimaryGeneratedColumn, Column,Unique ,CreateDateColumn,UpdateDateColumn} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";
///////tabla USER
@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(6)
    @IsEmail()
    @IsNotEmpty()
    username:string;

    @Column()
    @IsNotEmpty()
    @MinLength(6)
    email:string;

    @Column()
    @IsNotEmpty()
    @MinLength(6)
    password:string;

    @Column()
    @IsNotEmpty()
    tipo_user:string;

    @Column()
    @IsNotEmpty()
    @MinLength(6)
    estado:string;

    hashPassword():void{
        const salt =bcrypt.genSaltSync(10);
        this.password=bcrypt.hashSync(this.password,salt);
    }

    checkPassword(password:string):boolean{
        return bcrypt.compareSync(password,this.password);
    }

}
