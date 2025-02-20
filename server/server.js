const express = require("express");
const bodyParser = require('body-parser');

const { resources } = require("./resources");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json({ strict: true }));

resources.forEach(resource => {
    if (resource.get != null) {
      app.get(resource.path, resource.get);
    }
    if (resource.post != null) {
      app.post(resource.path, resource.post);
    }
    if (resource.delete != null) {
      app.delete(resource.path, resource.delete);
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});