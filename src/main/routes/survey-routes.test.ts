import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import app from '@/main/config/app'
import env from '@/main/config/env'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Luan',
        email: 'teste123@gmail.com',
        password: '123',
        role: 'admin'
      })
      const id = MongoHelper.mapInsertOneResult(res, {}).id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: new ObjectId(id)
      }, {
        $set: {
          accessToken
        }
      })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200/204 on load surveys with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Luan',
        email: 'teste123@gmail.com',
        password: '123'
      })
      const id = MongoHelper.mapInsertOneResult(res, {}).id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: new ObjectId(id)
      }, {
        $set: {
          accessToken
        }
      })
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)

      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }])

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
