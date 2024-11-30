import { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Unit Session',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '702532803931-uu9bask4n338914e0pdu3iaae4c4ao7g.apps.googleusercontent.com'
    }
  }
};

export default config;
