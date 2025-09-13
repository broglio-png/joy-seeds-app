import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.df96d93fd6ff4079adc55d11ef8e5567',
  appName: 'joy-seeds-app',
  webDir: 'dist',
  server: {
    url: 'https://df96d93f-d6ff-4079-adc5-5d11ef8e5567.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4F46E5",
      showSpinner: false
    }
  }
};

export default config;