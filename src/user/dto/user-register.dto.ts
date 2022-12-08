import { UserRoleEnum } from './../../enum/user-role.enum';
import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UserRegisterDto {
    @ApiProperty({
        description: 'Username of the user'
    })
    @IsNotEmpty()
    @IsString()
    surname: string;

    @ApiProperty({
        description: 'Password of the user'
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description: 'Email of the user'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Role of the user',
        enum: UserRoleEnum,
    })
    @IsOptional()
    role: UserRoleEnum;
}