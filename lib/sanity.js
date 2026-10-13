import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

export const sanityConfigured = Boolean(projectId);
export const sanityCanWrite = Boolean(projectId && token);

// Used on the server only (getServerSideProps and API routes). The token never reaches the browser.
export const client = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-10-01',
      useCdn: false,
      token: token || undefined,
    })
  : null;
