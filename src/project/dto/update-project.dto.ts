import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {

    @ApiProperty({
        description: 'Name of the project',
        example: 'My project',
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Description of the project',
        example: 'This is my project',
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'En attente de suppression',
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(14)
    @Max(120)
    age: number;
    
    @ApiProperty({
        description: 'soft delete'
    })
    @IsOptional()
    deletedAt: Date;


}