import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  return {
    base: process.env.VITE_BASE_PATH ?? (command === 'build' ? '/eventsphere/' : '/'),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve('index.html'),
          about: path.resolve('about/index.html'),
          services: path.resolve('services/index.html'),
          aiPlanner: path.resolve('ai-planner/index.html'),
          vendors: path.resolve('vendors/index.html'),
          blog: path.resolve('blog/index.html'),
          contact: path.resolve('contact/index.html'),
          vendorInsights: path.resolve('vendor-insights/index.html'),
          joinAsAVendor: path.resolve('join-as-a-vendor/index.html'),
          checklists: path.resolve('checklists/index.html'),
          checklistWeddings: path.resolve('checklists/weddings/index.html'),
          checklistEngagementsAndProposals: path.resolve(
            'checklists/engagements-and-proposals/index.html'
          ),
          checklistElopements: path.resolve('checklists/elopements/index.html'),
          checklistMilestoneBirthdays: path.resolve(
            'checklists/milestone-birthdays/index.html'
          ),
          checklistDiwaliAndFestivalOfLights: path.resolve(
            'checklists/diwali-and-festival-of-lights/index.html'
          ),
          checklistLunarNewYear: path.resolve('checklists/lunar-new-year/index.html'),
          checklistEid: path.resolve('checklists/eid/index.html'),
          checklistChristeningsAndBabyShowers: path.resolve(
            'checklists/christenings-and-baby-showers/index.html'
          ),
          checklistGraduations: path.resolve('checklists/graduations/index.html'),
          checklistCommunityFestivals: path.resolve(
            'checklists/community-festivals/index.html'
          ),
          checklistCorporateEvents: path.resolve('checklists/corporate-events/index.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
