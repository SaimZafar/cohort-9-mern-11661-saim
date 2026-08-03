const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
  };

  it('should sign up a new user', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        expect(res.body.user).to.have.property('email', testUser.email);
        done();
      });
  });

  it('should reject signup with missing fields', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send({ email: 'incomplete@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should log in an existing user', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should reject login with wrong password', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});