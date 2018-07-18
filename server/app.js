const service = require('./service');

function welcome() {
  process.stdout.write('\n=========== TASK ===========\n');
}

module.exports = function () {
  welcome();
  let app = service.createApp();
  app = service.setupWebpack(app);
  app = service.setupStaticRoutes(app);
  service.setupMongooseConnections();
  app = service.setupMiddlewares(app);
  app = service.setupAppRoutes(app);
  app = service.setupRESTRoutes(app);
  service.convertToJSON();
  return app;
};
