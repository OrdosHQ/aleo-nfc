import express, { Request, Response } from 'express'
import session from 'express-session'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import bodyParser from 'body-parser'

import { Strategy as TwitterStrategy } from '@superfaceai/passport-twitter-oauth2'
import { config } from 'dotenv'
import { StartDB } from './db'
import { createUser, getUserById, getUserByTwitterId } from './repository/user.repo'
import { createUserRecord, getUserRecordById, getUserRecordsByUserId } from './repository/record.repo'
import { getAleoTransaction } from './aleo/aleo.service'

config()
StartDB()

const JWT_SECRET = 'your_jwt_secret' // Установите свой секретный ключ
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!
const HOST = process.env.HOST!
const REDIRECT_URL = process.env.REDIRECT_URL!

const EXPRESS_SESSION_SECRET = '1234'
const PORT = 3000

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((obj: any, cb) => {
  cb(null, obj)
})

passport.use(
  new TwitterStrategy(
    {
      clientID: TWITTER_CLIENT_ID,
      clientSecret: TWITTER_CLIENT_SECRET,
      clientType: 'confidential',
      callbackURL: `${HOST}/auth/twitter/callback`,
      scope: ['users.read', 'tweet.read', 'offline.access'],
    },
    (accessToken, refreshToken, profile, done) => {
      // Аутентификация пользователя
      console.log('Success!', { accessToken, refreshToken })
      console.log('Profile', profile)

      return done(null, profile)
    },
  ),
)

// Middleware для проверки JWT
const authenticateJwt = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' })
    req.user = decoded
    next()
  })
}

const app = express()

app.use(bodyParser.json())
app.use(cors({ origin: true }))
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/twitter/callback', passport.authenticate('twitter'), async (req, res) => {
  const { id, username, displayName, photos } = req.user as any

  let user = await getUserByTwitterId(id.toString())

  if (!user) {
    user = await createUser({
      twitterId: id.toString(),
      username,
      displayName,
      photoUrl: photos[0].value ?? '',
    })
  }

  // Генерация JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
  console.log('token', token)

  res.redirect(`${REDIRECT_URL}?id=${user.id}&username=${user.username}&displayName=${encodeURIComponent(user.displayName)}&photoUrl=${encodeURIComponent(user.photoUrl)}&token=${token}`)
})

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/protected-route', authenticateJwt, (req, res) => {
  const user = req.user
  console.log(user)
  res.json({ message: 'You are authorized' })
  // Логика для защищенного роута
})

// Получение записей пользователя
app.get('/user/records', authenticateJwt, async (req, res) => {
  try {
    const userInfo = req.user as { userId: number }
    const records = await getUserRecordsByUserId(userInfo.userId)
    res.json({
      records,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Получение информации о пользователе
app.get('/user', authenticateJwt, async (req, res) => {
  try {
    const userInfo = req.user as { userId: number }
    const user = await getUserById(userInfo.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/user/record', authenticateJwt, async (req, res) => {
  try {
    const { userId } = req.user as { userId: number }
    const recordData = req.body // данные записи получаем из тела запроса
    const recordInfo = await getAleoTransaction(recordData.id)
    if (!recordInfo.result) {
      return res.status(500).json({ message: 'Internal server error' })
    }

    const record = await createUserRecord({
      userId,
      checksum: recordInfo.result.transaction.execution.transitions[0].outputs[0].checksum,
      value: recordInfo.result.transaction.execution.transitions[0].outputs[0].value,
      recordId: recordInfo.result.transaction.id,
    })

    res.status(201).json(record)
  } catch (error) {
    console.log(error)

    res.status(500).json({ message: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Api is running on port ${PORT}`)
})
