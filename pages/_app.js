import '../styles/globals.css';
import { StroreProvider } from '../utils/Store';

function MyApp({ Component, pageProps }) {
  return (
    <StroreProvider>
      <Component {...pageProps} />
    </StroreProvider>
  );
}

export default MyApp;
