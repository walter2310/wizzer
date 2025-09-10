import { IsNotEmpty, IsString } from 'class-validator';

export class FetchResponseDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  createdAt: string;
}
