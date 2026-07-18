const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
const { expect } = chai;

describe('Notes API', () => {
  const testUser = {
    name: 'Notes Tester',
    email: `notes${Date.now()}@example.com`,
    password: 'password123',
  };

  let token;
  let createdNoteId;

  before((done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send(testUser)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should reject requests without a token', (done) => {
    chai.request(app)
      .get('/api/notes')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should create a note', (done) => {
    chai.request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Note', content: 'Some content' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.note).to.have.property('title', 'Test Note');
        createdNoteId = res.body.note.id;
        done();
      });
  });

  it('should fetch all notes for the user', (done) => {
    chai.request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.notes).to.be.an('array');
        done();
      });
  });

  it('should update a note', (done) => {
    chai.request(app)
      .put(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Note', content: 'Updated content' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.note).to.have.property('title', 'Updated Note');
        done();
      });
  });

  it('should delete a note', (done) => {
    chai.request(app)
      .delete(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});