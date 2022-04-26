/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
    // test: { url: "/test" },
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript",
    // '@snowpack/plugin-postcss',
    '@snowpack/plugin-sass',
    "snowpack-plugin-hash",
  ],
  alias: {
    "@app": "./src",
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    bundle: true,
    optimize: true,
  },
  packageOptions: {
    knownEntrypoints: [ 'react-dom' ]
  },
  devOptions: {
    // hmrErrorOverlay: false,
  },
  buildOptions: {
    /* ... */
  },
};
