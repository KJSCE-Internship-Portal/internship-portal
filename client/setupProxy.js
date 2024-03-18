const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    'https://sli-kjsce.somaiya.edu',  // You can change this path to match your API endpoints
    createProxyMiddleware({
      target: 'https://sli-kjsce.somaiya.edu:3000',
      changeOrigin: true,
    })
  );
};
