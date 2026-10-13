import Header from './Header';
import Footer from './Footer';

// Read directly so the Sanity client is not bundled for the browser.
const sanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="app-bg" aria-hidden="true" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      {!sanityConfigured && (
        <div className="bg-yellow-300 px-4 py-2 text-center text-sm font-semibold text-slate-900">
          Demo mode: showing sample products. Set the Sanity environment variables to use real data.
        </div>
      )}
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
