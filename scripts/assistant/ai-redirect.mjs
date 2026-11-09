// TEST-ONLY preload (node --import): sends the assistant's DeepSeek call to a local mock. Never present in the production image or run.
const target = process.env.MOCK_AI_URL;
const realFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  if (target && new URL(url).hostname === "api.deepseek.com") return realFetch(target + new URL(url).pathname, init);
  return realFetch(input, init);
};
