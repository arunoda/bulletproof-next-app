import { Provider } from 'next-auth/client'

export default function App({ Component, pageProps }) {
    return (
        <Provider>
            <Component {...pageProps} />
        </Provider>
    )
}