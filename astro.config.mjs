import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import swup from '@swup/astro';

import tailwind from '@astrojs/tailwind';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // output: 'static',
  // | hybrid | static | server
  site: 'https://khaledsanny.vercel.app',
  // integrations: [mdx(), sitemap(), swup()],
  // integrations: [mdx(), sitemap(), tailwind()]
  // integrations: [mdx(), sitemap(), icon(), swup()],
  integrations: [mdx(), sitemap(), icon()],
});
