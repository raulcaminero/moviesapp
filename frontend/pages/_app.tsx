import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Headbar from '../components/Headbar';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Hide headbar on landing, sign in, and create user pages
  const hideHeadbar =
    router.pathname === '/' ||
    router.pathname === '/signin' ||
    router.pathname === '/create-user';

  return (
    <>
      {!hideHeadbar && <Headbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;