import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {  
reporter: [ ['junit', { outputFile: 'results.xml' }] ],
 use: {
   headless: false,
   screenshot:"on",
   viewport: null,
   launchOptions: {
    args: ['--start-maximized'],
    
  },
  actionTimeout: 30000,
  navigationTimeout: 30000
 },
};
export default config;