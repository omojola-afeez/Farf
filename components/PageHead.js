import Head from 'next/head';
import { siteConfig } from '@/lib/siteConfig';

export default function PageHead({ title, description }) {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | ${siteConfig.tagline}`;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta
        name="description"
        content={description || 'Kitchen tools, school supplies, DIY tools, gadgets and home utilities in one place.'}
      />
    </Head>
  );
}
