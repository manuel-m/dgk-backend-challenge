import express from "express";

export function RestApp({ mservice_id, port, routes }) {
  const app = express();

  process.on("SIGTERM", () => {
    process.exit(0);
  });

  app.get("/health", function (req, res) {
    res.end();
  });

  for (const [uri, method, fn] of routes) {
    app[method](uri, fn);
  }

  app.listen(port, () => {
    console.log(mservice_id + " listening on :" + port);
  });

  return app;
}
