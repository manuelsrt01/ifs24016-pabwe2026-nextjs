import { spawn } from "bun";

const mode = process.argv[2] === "start" ? "start" : "dev";
const port = process.env.APP_PORT || "3000";

const child = spawn(["bun", "x", "next", mode, "-p", port], {
  stdio: ["inherit", "inherit", "inherit"],
  env: process.env,
});

process.exit(await child.exited);
