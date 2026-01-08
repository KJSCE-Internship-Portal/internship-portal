const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    'https://sli-kjsce.somaiya.edu', // or any specific path you want to proxy
    createProxyMiddleware({
      target: 'https://sli-kjsce.somaiya.edu:3000',  // Proxy to your development server
      changeOrigin: true,
      secure: false
    })
  );
};







