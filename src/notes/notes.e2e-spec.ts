import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/common/utils/utils.module';
import { envs } from 'src/config';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { Note } from './entities/note.entity';
import { NotesModule } from './notes.module';

describe('Notes E2E', () => {
  let app: INestApplication;
  let createdNoteId: string;
  const testNoteIds: string[] = [];

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: envs.dbHost,
          port: envs.dbPort,
          username: envs.dbUsername,
          password: envs.dbPassword,
          database: envs.dbName,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: envs.dbSynchronize
        }),
        TypeOrmModule.forFeature([Note]),
        NotesModule,
        UtilsModule
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should create a note', async () => {
    const response = await request(app.getHttpServer())
      .post('/notes')
      .send({ text: 'This is a test note.' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('msg', 'Note created');

    const getAll = await request(app.getHttpServer()).get('/notes');
    expect(getAll.status).toBe(200);
    expect(getAll.body.data.length).toBeGreaterThan(0);

    createdNoteId = getAll.body.data[0].id;
    testNoteIds.push(createdNoteId);
  });

  it('should get all notes', async () => {
    const response = await request(app.getHttpServer()).get('/notes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('text');
    expect(response.body.data[0]).toHaveProperty('createdAt');
  });

  it('should get a note by id', async () => {
    const response = await request(app.getHttpServer()).get(
      `/notes/${createdNoteId}`
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', createdNoteId);
    expect(response.body.data).toHaveProperty('text');
    expect(response.body.data).toHaveProperty('createdAt');
  });

  it('should update a note', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/notes/${createdNoteId}`)
      .send({ text: 'Updated note text.' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg', 'Note updated');

    const getResponse = await request(app.getHttpServer()).get(
      `/notes/${createdNoteId}`
    );
    expect(getResponse.body.data).toHaveProperty('text', 'Updated note text.');
  });

  it('should delete a note', async () => {
    const response = await request(app.getHttpServer()).delete(
      `/notes/${createdNoteId}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg', 'Note deleted');

    const getResponse = await request(app.getHttpServer()).get(
      `/notes/${createdNoteId}`
    );
    expect(getResponse.status).toBe(500);
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    const noteRepo = dataSource.getRepository(Note);

    for (const id of testNoteIds) {
      await noteRepo.delete(id);
    }

    await app.close();
  });
});
