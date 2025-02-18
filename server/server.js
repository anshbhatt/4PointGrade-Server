const express = require("express");
const { resources } = require("./resources");

const PORT = process.env.PORT || 3001;

const app = express();

resources.forEach(resource => {
    if (resource.get != null) {
        app.get(resource.path, resource.get);
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});