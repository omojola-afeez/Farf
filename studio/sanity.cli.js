import { defineCliConfig } from 'sanity/cli';

const clean = (v) => String(v || '').trim().replace(/^["']|["']$/g, '').trim();
const projectId = clean(process.env.SANITY_STUDIO_PROJECT_ID);
const dataset = (clean(process.env.SANITY_STUDIO_DATASET) || 'production').toLowerCase();

// Fail the build with a clear message instead of deploying a studio that shows "An error occurred".
if (!/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID is missing or invalid. Add it in Vercel (Settings, Environment Variables), then redeploy.'
  );
}
if (!/^[a-z0-9_-]{1,64}$/.test(dataset)) {
  throw new Error(
    `SANITY_STUDIO_DATASET "${dataset}" is invalid. Use lowercase letters, numbers, dashes or underscores, for example production.`
  );
}

export default defineCliConfig({
  api: { projectId, dataset },
});
