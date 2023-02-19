import { IsString, IsNotEmpty, IsNumber, Min, Max, IsBoolean } from 'class-validator';
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
        description: 'Short description of the project',
        example: 'This is my project',
    })
    @IsNotEmpty()
    @IsString()
    shortDescription: string;

    @ApiProperty({
        description: 'Description of the project',
        example: 'This is my project',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Project is online or not',
    })
    @IsBoolean()
    isOnLineProject: boolean;

    @ApiProperty({
        description: 'Project is searching for people or not',
    })
    @IsBoolean()
    isSearchPersonn: boolean;

    @ApiProperty({
        description: 'En attente de suppression',
    })
    @IsNumber()
    @Type(() => Number)
    @Min(14)
    @Max(120)
    age: number;
}