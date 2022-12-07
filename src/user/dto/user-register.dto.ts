import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEmail, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class userRegisterDto {
    @IsNotEmpty()
    @IsString()
    surname: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}