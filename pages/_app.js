import Head from 'next/head';
import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F766E" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}
