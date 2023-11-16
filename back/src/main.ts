import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy as TwitterStrategy } from '@superfaceai/passport-twitter-oauth2'
import { config } from 'dotenv'

config()

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!
const HOST = process.env.HOST!
const REDIRECT_URL = process.env.REDIRECT_URL!

console.log(TWITTER_CLIENT_ID)
console.log(TWITTER_CLIENT_SECRET)

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

const app = express()

app.use(
  session({
    secret: EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback', passport.authenticate('twitter'), (req, res) => {
  const { id, username, displayName, photos } = req.user as any

  const photoUrl = photos[0].value ?? ''

  res.redirect(`${REDIRECT_URL}?id=${id}&username=${username}&displayName=${encodeURIComponent(displayName)}&photoUrl=${encodeURIComponent(photoUrl)}`)
})

app.listen(PORT, () => {
  console.log(`Api is running on port ${PORT}`)
})
