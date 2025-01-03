const request = require('supertest');
const app = require('./server');
const client = require('./db');

describe('Інтеграційні тести для API', function () {
  let uniqueUsername: string;

  beforeAll(async () => {
    uniqueUsername = `test_user_${Date.now()}`;

    await client.query(`
      INSERT INTO users (username, password) 
      VALUES ('${uniqueUsername}', 'password123')
    `);
  });

  beforeEach(async () => {
    await client.query(`
      INSERT INTO history (user_id, district, floor, floors_count, rooms_count, total_square_meters, predict_price) 
      VALUES (1, 'Оболонь', 5, 10, 3, 80.4, 30000)
    `);
  });

  it('повинен повертати дані користувачів', async () => {
    const response = await request(app).get('/users_test'); 

    expect(response.status).toBe(200);
  });

  it('повинен повертати історію для користувача', async () => {
    const response = await request(app).get('/history_test'); 

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
