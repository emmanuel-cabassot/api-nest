import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginCredentialsDto {
    @ApiProperty({
        description: 'Username of the user',
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Password of the user',
    })
    @IsNotEmpty()
    password: string;
}