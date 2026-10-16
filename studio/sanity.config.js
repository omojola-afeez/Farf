import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';



export default defineConfig({
  name: 'farf',
  title: 'FARF',
  projectId: (process.env.SANITY_STUDIO_PROJECT_ID || '').trim(),
  dataset: (process.env.SANITY_STUDIO_DATASET || 'production').trim().toLowerCase(),
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
