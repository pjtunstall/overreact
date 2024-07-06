const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const server = http.createServer((req, res) => {
  const requestUrl = url.parse(req.url, true);

  const isSPARoute =
    requestUrl.pathname === "/" ||
    requestUrl.pathname === "/active" ||
    requestUrl.pathname === "/completed";

  let filePath = path.join(
    __dirname,
    isSPARoute ? "index.html" : requestUrl.pathname
  );

  let contentType;
  switch (path.extname(filePath)) {
    case ".js":
      contentType = "application/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".html":
      contentType = "text/html";
      break;
    default:
      contentType = "text/plain";
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Error loading " + requestUrl.pathname);
    }

    res.writeHead(200, {
      "Content-Type": contentType,
    });
    res.end(data);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server listening on port ${port}`));
