module.exports = {
  apps: [
    {
      name: "events",
      script: "./events.js",
      cwd: "dist",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      watch: true,
    },
    {
      name: "users",
      script: "./users.js",
      cwd: "dist",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      watch: true,
    },
  ],
};
