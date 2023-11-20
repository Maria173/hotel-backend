const request = require('supertest');
const app = require('../backend');
const db = require('./queries');

describe('GET /', () => {
  it('should return the correct response', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ info: 'Node.js, Express, and Postgres API' });
  });
});

describe('GET /rooms returns status code 200', () => {
  it('should return the list of rooms', async () => {
    const response = await request(app).get('/rooms');
    expect(response.statusCode).toBe(200);
  });
});

const firstRoom = {
  id: 1,
  name: 'Австрия',
  type: 'Стандарт',
  description: 'Уютный стандартный номер с видом на лес',
  price: 5000,
  breakfast: false,
  pets: false,
  image: 'https://thumb.tildacdn.com/tild3634-3534-4830-b463-306534616666/-/format/webp/EE5BBA7F-62AE-4D5E-B.jpg'
};
describe('GET /rooms returns correct data', () => {
  it('should return the list of rooms', async () => {
    const response = await request(app).get('/rooms');
    expect(response.statusCode).toBe(200);
    expect(response.body[0].id).toBe(firstRoom.id);
    expect(response.body[0].name).toBe(firstRoom.name);
    expect(response.body[0].type).toBe(firstRoom.type);
    expect(response.body[0].description).toBe(firstRoom.description);
    expect(response.body[0].price).toBe(firstRoom.price);
    expect(response.body[0].breakfast).toBe(firstRoom.breakfast);
    expect(response.body[0].pets).toBe(firstRoom.pets);
    expect(response.body[0].image).toBe(firstRoom.image);
  });
});

describe('GET /rooms/:id returns status code 200', () => {
  it('should return a specific room', async () => {
    const response = await request(app).get('/rooms/1');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /rooms/:id returns correct data', () => {
  it('should return a specific room', async () => {
    const response = await request(app).get('/rooms/1');
    expect(response.statusCode).toBe(200);
    expect(response.body[0].id).toBe(firstRoom.id);
    expect(response.body[0].name).toBe(firstRoom.name);
    expect(response.body[0].type).toBe(firstRoom.type);
    expect(response.body[0].description).toBe(firstRoom.description);
    expect(response.body[0].price).toBe(firstRoom.price);
    expect(response.body[0].breakfast).toBe(firstRoom.breakfast);
    expect(response.body[0].pets).toBe(firstRoom.pets);
    expect(response.body[0].image).toBe(firstRoom.image);
  });
});

describe('GET /lala returns status code 404', () => {
  it('should return 404 not found error', async () => {
    const response = await request(app).get('/lala');
    expect(response.statusCode).toBe(404);
  });
});

describe('POST /book', () => {
  it('should return the correct response', async () => {
    const response = await request(app)
      .post('/book')
      .send({
        roomId: 1,
        dateIn: '2022-01-01',
        dateOut: '2022-01-05',
        fio: 'John Doe',
        phone: '123456789',
        email: 'john@example.com',
      });
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe('Бронирование успешно завершено');
  });
});