import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Booking (e2e)', () => {
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

  describe('/booking (POST)', () => {
    it('应该成功创建预约', () => {
      return request(app.getHttpServer())
        .post('/booking/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seatsBooked: 1 })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toBeDefined();
          expect(res.body.data.seatsBooked).toBe(1);
        });
    });

    it('应该返回 400 当座位数无效时', () => {
      return request(app.getHttpServer())
        .post('/booking/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seatsBooked: 0 })
        .expect(400);
    });
  });

  describe('/booking/my (GET)', () => {
    it('应该返回我的预约列表', async () => {
      return request(app.getHttpServer())
        .get('/booking/my')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('/booking/:id (GET)', () => {
    it('应该返回预约详情', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/booking/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seatsBooked: 1 });

      const bookingId = createRes.body.data.id;

      return request(app.getHttpServer())
        .get(`/booking/${bookingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.id).toBe(bookingId);
        });
    });
  });

  describe('/booking/:id/confirm (POST)', () => {
    it('应该确认预约', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/booking/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seatsBooked: 1 });

      const bookingId = createRes.body.data.id;

      return request(app.getHttpServer())
        .post(`/booking/${bookingId}/confirm`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);
    });
  });

  describe('/booking/:id/cancel (POST)', () => {
    it('应该取消预约', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/booking/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seatsBooked: 1 });

      const bookingId = createRes.body.data.id;

      return request(app.getHttpServer())
        .post(`/booking/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: '个人原因' })
        .expect(201);
    });
  });
});
