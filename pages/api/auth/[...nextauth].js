import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { saveUser, getUser } from '../../../lib/data'

const providers = []

if (process.env.GITHUB_CLIENT_ID) {
    providers.push(
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        })
    )
} else {
    providers.push(
        Providers.Credentials({
          name: 'local',
          credentials: {
            username: {label: 'Username', type: 'text'}
          },
    
          async authorize({ username }) {
            return {
              id: username,
              name: username,
              email: `${username}@email.com`,
              image: `https://api.adorable.io/avatars/128/${username}.png`
            }
          }
        })
      )
}

const callbacks = {}

callbacks.signIn = async function signIn(user, account, metadata) {
    if (account.provider === 'github') {
        const emailRes = await fetch('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `token ${account.accessToken}`
            }
        })
        const emails = await emailRes.json()
        const primaryEmail = emails.find(e => e.primary).email;
    
        const githubUser = {
            id: metadata.id,
            login: metadata.login,
            name: metadata.name,
            email: primaryEmail,
            avatar: user.image
        }
    
        user.id = await saveUser('github', githubUser)
        return true
    }

    if (account.type === 'credentials') {
        const localUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.image
        }
        user.id = await saveUser('local', localUser)
        return true
    }

    return false;
}

callbacks.jwt = async function jwt(token, user) {
    if (user) {
        token = { id: user.id }
    }

    return token
}

callbacks.session = async function session(session, token) {
    const dbUser = await getUser(token.id)
    if (!dbUser) {
        return null
    }

    session.user = {
        id: dbUser.id,
        profile: dbUser.profile
    }

    return session
}

const options = {
    providers,
    session: {
        jwt: true
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'this-should-be-a-secret'
    },
    callbacks
}

export default (req, res) => NextAuth(req, res, options)