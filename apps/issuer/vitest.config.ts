import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    tsconfigPaths(), // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],

  test: {
    globals: true,
    watch: false,
    pool: 'forks',
    include: ['**/*.spec.ts'],
    silent: true,
    cache: false,
    environment: 'node', // or 'happy-dom', 'jsdom'
    server: {
      deps: {
        fallbackCJS: true,
        external: ['did-resolver', 'did-jwt-vc'],
      },
    },
    testTimeout: 60000,
    hookTimeout: 60000,
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 8,
      },
    },
    logHeapUsage: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      clean: true,
      reporter: ['lcov'],
      include: ['src/**/*.ts'],
    },
  },
});
