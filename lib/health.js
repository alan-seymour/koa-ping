const os = require('os');
const df = require('node-df');
const path = require('path');

const appRootDir = require('app-root-path');

const pjson = require(`${appRootDir}${path.sep}package.json`);

const DEFAULT_PATH = '/ping';

const getStats = async (hideFields) => {
  const result = new Promise((resolve, reject) => {
    df((error, diskInfo) => {
      if (error) {
        reject(new Error('Error'));
      } else {
        const details = {
          timestamp: Date.now(),
          uptime: process.uptime(),

          application: {
            name: pjson.name,
            version: pjson.version,
            pid: process.pid,
            title: process.title,
            argv: process.argv,
            versions: process.versions,
            node_env: process.env.NODE_ENV,
          },

          resources: {
            memory: process.memoryUsage(),
            loadavg: os.loadavg(),
            cpu: os.cpus(),
            disk: diskInfo,
            nics: os.networkInterfaces(),
          },

          system: {
            arch: process.arch,
            platform: process.platform,
            type: os.type(),
            release: os.release(),
            hostname: os.hostname(),
            uptime: os.uptime(),
            cores: os.cpus().length,
            memory: os.totalmem(),
          },
        };
        hideFields.forEach((field) => {
          delete details[field];
        });
        resolve(details);
      }
    });
  });

  return result;
};

module.exports = (routePath = DEFAULT_PATH, hideFields = []) => async (ctx, next) => {
  if (routePath === ctx.path) {
    ctx.body = await getStats(hideFields);
  } else {
    await next();
  }
};
