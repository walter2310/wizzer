import 'dotenv/config';
import * as joi from 'joi';

interface EnvsVars {
  PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_HOST: string;
  DB_SYNCHRONIZE: boolean;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_SYNCHRONIZE: joi.boolean().required()
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envsVars: EnvsVars = value;

export const envs = {
  port: envsVars.PORT,
  dbUsername: envsVars.DB_USERNAME,
  dbPort: envsVars.DB_PORT,
  dbName: envsVars.DB_NAME,
  dbPassword: envsVars.DB_PASSWORD,
  dbHost: envsVars.DB_HOST,
  dbSynchronize: envsVars.DB_SYNCHRONIZE
};
