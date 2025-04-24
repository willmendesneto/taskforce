import { defineConfig } from 'cypress';
import { loadEnv } from 'vite';

// Load environment variables from .env files
// eslint-disable-next-line no-undef
const env = loadEnv('development', process.cwd(), '');

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    // ...other config
    setupNodeEvents(on, _config) {
      // Handle API errors better
      on('before:browser:launch', (_browser, launchOptions) => {
        launchOptions.args.push('--disable-features=NetworkErrorLogging');
        return launchOptions;
      });
    },
  },
  env: {
    // Add Vite environment variables
    ...env,
  },
});
