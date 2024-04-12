module.exports = {
  // Other Jest configuration options...
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\\/]+$",
    "\\.css$",
    "\\.(jpg|jpeg|png|gif|svg)$" // Add this line to ignore image files
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/mockFile.js" // Map image imports to a mock file
  },
  testEnvironment: "jsdom"
};