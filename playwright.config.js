import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    workers: 1,
    reporter: 'html',
    
    use: {
      baseURL: 'https://vite-react-alpha-lemon.vercel.app/'
    },
  
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      }
    ],
  });