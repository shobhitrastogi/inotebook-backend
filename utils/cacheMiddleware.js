const client = require('../redis/redisClient');

const cache = (req, res, next) => {
  const key = req.originalUrl || req.url;

  client.get(key, (err, data) => {
    if (err) throw err;
    if (data != null) {
      res.json(JSON.parse(data));
    } else {
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setEx(key, 3600, JSON.stringify(body)); // Cache for 1 hour
        res.sendResponse(body);
      };
      next();
    }
  });
};

module.exports = cache;
