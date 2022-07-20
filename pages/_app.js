import '../styles/globals.css';
import { StroreProvider } from '../utils/Store';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StroreProvider>
        <Component {...pageProps} />
      </StroreProvider>
    </SessionProvider>
  );
}

export default MyApp;
