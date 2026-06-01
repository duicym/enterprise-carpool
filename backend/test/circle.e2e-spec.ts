import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Circle (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const dataSource = app.get(DataSource);
    await dataSource.dropDatabase();
    await dataSource.runMigrations(['src/migrations/1717200000000-InitialTables.ts']);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/wechat-login')
      .send({ code: 'test_code_user1' });
    authToken = loginRes.body.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/circle (POST)', () => {
    it('应该成功创建圈子', () => {
      return request(app.getHttpServer())
        .post('/circle')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '测试圈子',
          type: 1,
          description: '测试描述',
          isPublic: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toBe('测试圈子');
          expect(res.body.data.ownerId).toBeDefined();
        });
    });
  });

  describe('/circle/my (GET)', () => {
    it('应该返回我的圈子列表', () => {
      return request(app.getHttpServer())
        .get('/circle/my')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('/circle/search (GET)', () => {
    it('应该搜索圈子', () => {
      return request(app.getHttpServer())
        .get('/circle/search?keyword=测试')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
