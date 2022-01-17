const babel = require("gulp-babel");
const { src, dest, series } = require("gulp");
const { exec } = require("child_process");

const build = () => src("src/**/*.js")
  .pipe(babel())
  .pipe(dest("dist/src/"));

const copyIndex = () => src("index.js")
  .pipe(babel())
  .pipe(dest("dist/"));

const start = () => {
  const server = exec("node dist/index.js", {
    cwd: process.cwd(),
    env: { PORT: 3000, MODE: "prod"}
  });

  server.stdout.on("data", (chunk) => console.log(chunk.toString()));
  server.stderr.on("data", (err) => console.error(err));

  return server;
};

exports.default = series(copyIndex, build, start);
