import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

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

    user.email = primaryEmail;
}

const options = {
    providers,
    callbacks
}

export default (req, res) => NextAuth(req, res, options)