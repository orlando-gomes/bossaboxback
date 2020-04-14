import request from 'supertest';

import app from '../../src/app';

import truncate from '../util/truncate';

beforeEach(async () => {
  await truncate();
});

const saveUser1 = async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'UserTest1',
      email: 'usertest1@gmail.com',
      password: '123456',
    });

  return response.body;
};

const authUser1 = async () => {
  const responseUserAuth = await request(app)
    .post('/sessions')
    .send({
      email: 'usertest1@gmail.com',
      password: '123456',
    });

  return responseUserAuth.body.user.token;
};

describe('Tag', () => {
  it('should be able to fetch all tags', async () => {
    await saveUser1();

    const userToken = await authUser1();

    await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hotel',
        link: 'https://github.com',
        description: 'A tool created only for testing the API',
        tags: ['PHP', 'Ruby', 'Node', 'Devs'],
      });

    const response = await request(app)
      .get('/tags')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.body.length).toBe(4);
  });
});

describe('User', () => {
  it('should be able to register user 1', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should get response status(400) - email already used', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(400) - register without email', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'AnUser',
        email: '',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(400) - register without password', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'AnUser',
        email: 'usertest@gmail.com',
        password: '',
      });

    expect(response.status).toBe(400);
  });

  it('should authenticate UserTest1', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('user.token');
  });

  it('should get response status(400) - authenticate without email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: '',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(400) - authenticate without password', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest@gmail.com',
        password: '',
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(404)', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'not_found_email@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(404);
  });

  it('should get response status(401)', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: 'wrongPassword',
      });

    expect(response.status).toBe(401);
  });

  it('should be able to fetch all users', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const response1 = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = response1.body.user.token;

    await request(app)
      .post('/users')
      .send({
        name: 'UserTest2',
        email: 'usertest2@gmail.com',
        password: '123456',
      });

    await request(app)
      .post('/users')
      .send({
        name: 'UserTest3',
        email: 'usertest3@gmail.com',
        password: '123456',
      });

    const response2 = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(response2.body.length).toBe(3);
  });

  it('should be able to fetch an user by id', async () => {
    const responseUser1Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Id = responseUser1Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    await request(app)
      .post('/users')
      .send({
        name: 'UserTest2',
        email: 'usertest2@gmail.com',
        password: '123456',
      });

    await request(app)
      .post('/users')
      .send({
        name: 'UserTest3',
        email: 'usertest3@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .get(`/users/${user1Id}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(response.body.name).toBe('UserTest1');
  });

  it('should get response status(400) - Invalid id in show user', async () => {
    const responseUser1Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Id = responseUser1Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    const response = await request(app)
      .get(`/users/${user1Id + 10}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(response.status).toBe(400);
  });

  it("should be able to update an user's name", async () => {
    const responseUser1Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Id = responseUser1Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    const response = await request(app)
      .put(`/users/${user1Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'UserTest22',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    expect(response.body.name).toBe('UserTest22');
  });

  it('should get response status(400) - Invalid id in update user', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const responseUser2Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest2',
        email: 'usertest2@gmail.com',
        password: '123456',
      });

    const user2Id = responseUser2Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    const response = await request(app)
      .put(`/users/${user2Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'UserTest22',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(400) - Name and email required in update user', async () => {
    const responseUser1Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Id = responseUser1Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    const response = await request(app)
      .put(`/users/${user1Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'U',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(400) - Password validation failed in update user', async () => {
    const responseUser1Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Id = responseUser1Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    const response = await request(app)
      .put(`/users/${user1Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'UUserTest22',
        email: 'usertest1@gmail.com',
        password: '1',
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(401) - Invalid password in update user', async () => {
    const responseUser1Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Id = responseUser1Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    const response = await request(app)
      .put(`/users/${user1Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'UUserTest22',
        email: 'usertest1@gmail.com',
        password: '1234567',
      });

    expect(response.status).toBe(401);
  });

  it('should get response status(400) - Email already exists in update user', async () => {
    const responseUser1Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Id = responseUser1Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    await request(app)
      .post('/users')
      .send({
        name: 'UserTest2',
        email: 'usertest2@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .put(`/users/${user1Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'UUserTest22',
        email: 'usertest2@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });

  it("should be able to update an user's password", async () => {
    const responseUser1Save = await request(app)
      .post('/users')
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Id = responseUser1Save.body.id;

    const responseUser1Auth = await request(app)
      .post('/sessions')
      .send({
        email: 'usertest1@gmail.com',
        password: '123456',
      });

    const user1Token = responseUser1Auth.body.user.token;

    const response = await request(app)
      .put(`/users/${user1Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'UserTest1',
        email: 'usertest1@gmail.com',
        oldPassword: '123456',
        password: '1234567',
        confirmPassword: '1234567',
      });

    expect(response.status).toBe(200);
  });
});

describe('Tool', () => {
  it('should be able to save a tool', async () => {
    await saveUser1();

    const userToken = await authUser1();

    const response = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hotel',
        link: 'https://github.com',
        description: 'A tool created only for testing the API',
        tags: ['PHP', 'Ruby'],
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should get response status(400) - All fields are required', async () => {
    await saveUser1();

    const userToken = await authUser1();

    const response = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: '',
        link: 'https://github.com/orlando-gomes/times',
        description: 'Uma API para conhecimento do seu time de futebol',
        tags: ['Node', 'Express', 'Futebol', 'Time'],
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(400) - Invalid url', async () => {
    await saveUser1();

    const userToken = await authUser1();

    const response = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Time de futebol',
        link: 'lvnkdnklviinni88rjseheu',
        description: 'Uma API para conhecimento do seu time de futebol',
        tags: ['Node', 'Express', 'Futebol', 'Time'],
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(400) - At least one tag is required', async () => {
    await saveUser1();

    const userToken = await authUser1();

    const response = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Time de futebol',
        link: 'https://github.com/orlando-gomes/time',
        description: 'Uma API para conhecimento do seu time de futebol',
        tags: [],
      });

    expect(response.status).toBe(400);
  });

  it('should get response status(400) - Link has been already used', async () => {
    await saveUser1();

    const userToken = await authUser1();

    await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Um time de futebol',
        link: 'https://github.com/orlando-gomes/time',
        description: 'Uma API para conhecimento do seu time de futebol',
        tags: ['Node', 'Express', 'Futebol', 'Time'],
      });

    const response = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Outro time de futebol',
        link: 'https://github.com/orlando-gomes/time',
        description: 'Uma API para conhecimento do seu time de futebol',
        tags: ['Node', 'Express', 'Futebol', 'Time'],
      });

    expect(response.status).toBe(400);
  });

  it('should be able to fetch all tools', async () => {
    await saveUser1();

    const userToken = await authUser1();

    // saving the first tool
    await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hotel',
        link: 'https://github.com',
        description: 'A tool created only for testing the API',
        tags: ['PHP', 'Ruby'],
      });

    // saving the second tool
    await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'templatenode',
        link: 'https://github.com/orlando-gomes/templatenode',
        description: 'A template for creating node applications',
        tags: ['PHP', 'Apps', 'Node', 'Express'],
      });

    // saving the third tool
    await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Time de futebol',
        link: 'https://github.com/orlando-gomes/time',
        description: 'Uma API para conhecimento do seu time de futebol',
        tags: ['Node', 'Express', 'Futebol', 'Time'],
      });

    const response = await request(app)
      .get('/tools')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.body.length).toBe(3);
  });

  it('should be able to fetch a tool by id', async () => {
    await saveUser1();

    const userToken = await authUser1();

    const responseSaveTool = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hotel',
        link: 'https://github.com',
        description: 'A tool created only for testing the API',
        tags: ['PHP', 'Ruby'],
      });

    const { id } = responseSaveTool.body;

    const response = await request(app)
      .get(`/tools/${id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.body.title).toBe('Hotel');
  });

  it('should get response status(400) - Invalid id in show', async () => {
    await saveUser1();

    const userToken = await authUser1();

    const responseSaveTool = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hotel',
        link: 'https://github.com',
        description: 'A tool created only for testing the API',
        tags: ['PHP', 'Ruby'],
      });

    const { id } = responseSaveTool.body;

    const response = await request(app)
      .get(`/tools/${id + 10}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
  });

  it('should be able to delete a tool by id', async () => {
    await saveUser1();

    const userToken = await authUser1();

    const responseSaveTool = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hotel',
        link: 'https://github.com',
        description: 'A tool created only for testing the API',
        tags: ['PHP', 'Ruby'],
      });

    const { id } = responseSaveTool.body;

    const response = await request(app)
      .delete(`/tools/${id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(204);
  });

  it('should get response status(400) - Invalid id in delete', async () => {
    await saveUser1();

    const userToken = await authUser1();

    const responseSaveTool = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hotel',
        link: 'https://github.com',
        description: 'A tool created only for testing the API',
        tags: ['PHP', 'Ruby'],
      });

    const { id } = responseSaveTool.body;

    const response = await request(app)
      .delete(`/tools/${id + 10}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
  });

  it('should be able to fetch tools by tag "Ruby"', async () => {
    await saveUser1();

    const userToken = await authUser1();

    // saving the first tool
    await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hotel',
        link: 'https://github.com',
        description: 'A tool created only for testing the API',
        tags: ['PHP', 'Ruby'],
      });

    // saving the second tool
    await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'templatenode',
        link: 'https://github.com/orlando-gomes/templatenode',
        description: 'A template for creating node applications',
        tags: ['PHP', 'Apps', 'Node', 'Express'],
      });

    // saving the third tool
    await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Time de futebol',
        link: 'https://github.com/orlando-gomes/time',
        description: 'Uma API para conhecimento do seu time de futebol',
        tags: ['Node', 'Express', 'Futebol', 'Time'],
      });

    const response = await request(app)
      .get('/tools?tag=Ruby')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.body.length).toBe(1);
  });
});
