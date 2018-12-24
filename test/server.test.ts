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
  text: string | Object,
  status?: number,
  type?: string
) => {
  test(`GET ${url}`, async () => {
    const response = await supertest(server).get(url);
    expect(response.status).toEqual(status || 200);
    expect(response.type).toEqual(type || 'application/json');
    // convert JSON to string if necessary
    expect(response.text).toEqual((text instanceof Object) ? JSON.stringify(text) : text);
    // expect(response.text).toContain("Hello World!");
  });
};

describe('user route tests', () => {
  testGET('/api/users/1', {name: 'none'});
  testGET('/api/users/rr', {});
});
