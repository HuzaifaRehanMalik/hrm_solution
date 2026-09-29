// Test-only preload (node --import): sends the Neon HTTP driver to the local
// proxy from tests/docker-compose.yml, and refuses to reach any real Neon
// host, so a stray production DATABASE_URL can never be used by a test run.
const realFetch = globalThis.fetch;

globalThis.fetch = (input, init) => {
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.startsWith("https://api.localtest.me/sql")) {
    return realFetch("http://localhost:4444/sql", init);
  }
  if (/neon\.tech/i.test(url)) {
    throw new Error(`Test run tried to reach a real Neon host (${new URL(url).host}); refusing.`);
  }
  return realFetch(input, init);
};
