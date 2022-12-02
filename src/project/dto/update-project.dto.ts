import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(14)
    @Max(120)
    age: number;
    
    @IsOptional()
    deletedAt: Date;


}