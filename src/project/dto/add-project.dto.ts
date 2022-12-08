import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddProjectDto {
    
    @ApiProperty({
        description: 'Name of the project',
        example: 'My project',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Description of the project',
        example: 'This is my project',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'En attente de suppression',
    })
    @IsNumber()
    @Type(() => Number)
    @Min(14)
    @Max(120)
    age: number;
}