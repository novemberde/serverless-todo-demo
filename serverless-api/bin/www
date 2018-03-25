const app = require("../app");
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.on("error", (err) => console.error(err));

server.listen(port, () => console.log(`Server is running on ${port}`));