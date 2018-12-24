import supertest from 'supertest';
import server from '../src/server';

// silence console logs
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
// to silence logging, etc. during tests
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  // do something before anything else runs
  console.log('Jest starting!');
});

// teardown
afterAll(() => {
  server.close();
  console.log('Server closed!');
});

/**
 *
 * @param url URL to test
 * @param text expected return text
 * @param status expected HTTP status code
 * @param type expected HTTP return type
 */
const testGET = async (
  url: string,
  text: string,
  status?: number,
  type?: string
) => {
  const response = await supertest(server).get(url);
  expect(response.status).toEqual(status || 200);
  expect(response.type).toEqual(type || 'application/json');
  expect(response.text).toEqual(text);
  // expect(response.text).toContain("Hello World!");
};

describe('user route tests', () => {
  test('get user id route (valid id) GET /api/users/:id', async () => {
    // const response = await request(server).get("/api/users/1");
    // expect(response.status).toEqual(200);
    // expect(response.type).toEqual("application/json");
    // expect(response.text).not.toEqual("{}")
    // // expect(response.text).toContain("Hello World!");
    await testGET('/api/users/1', '{"name":"none"}');
  });
  test('get user id route (invalid id) GET /api/users/:id', async () => {
    await testGET('/api/users/rr', '{}');
  });
});
