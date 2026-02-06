const { existsSync, readFileSync } = require("fs");
const { resolve } = require("path");

const parseDotenv = (content) => {
  const out = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();

    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
};

const readLocalEnv = (relativePath) => {
  const filePath = resolve(__dirname, relativePath);
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, "utf8");
  return parseDotenv(content);
};

const getDbUrl = () => {
  const fromRuntime = process.env.DB_URL;
  if (fromRuntime) return fromRuntime;

  const fromApiNode = readLocalEnv("../../apps/api-node/local.env").DB_URL;
  if (fromApiNode) return fromApiNode;

  const fromApi = readLocalEnv("../../apps/api/local.env").DB_URL;
  if (fromApi) return fromApi;

  throw new Error(
    "DB_URL is missing. Define it in apps/api-node/local.env or apps/api/local.env (DB_URL=...) or export DB_URL in the environment."
  );
};

module.exports = {
  dialect: "postgresql",
  out: "./src",
  dbCredentials: {
    url: getDbUrl(),
  },
};
