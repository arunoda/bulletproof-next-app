import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { saveUser, getUser } from '../../../lib/data'

const providers = [
    Providers.GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
    })
]

const callbacks = {}

callbacks.signIn = async function signIn(user, account, metadata) {
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
    return true;
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
        github: {
            avatar: dbUser.github.avatar,
            login: dbUser.github.login,
            name: dbUser.github.name
        }
    }

    return session
}

const options = {
    providers,
    session: {
        jwt: true
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    callbacks
}

export default (req, res) => NextAuth(req, res, options)