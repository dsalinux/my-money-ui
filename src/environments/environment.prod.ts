export const environment = {
  production: true,
// apiUrl: 'https://app-mymoney-api.herokuapp.com'
  apiUrl: 'http://192.168.0.100:8080',
  whitelistedDomains: ['192.168.0.100:8080'],
  blacklistedRoutes: [`http://192.168.0.100:8080/oauth/token`]
};
