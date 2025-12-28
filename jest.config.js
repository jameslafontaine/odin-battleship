module.exports = {
    // Automatically import Jest globals (describe, test, expect, etc.)
    injectGlobals: true,

    // Test environment
    testEnvironment: "node",

    // Test match patterns
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],

    // Coverage configuration
    collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js", "!src/**/*.spec.js"],

    // Transform files with babel-jest (Babel is installed)
    transform: {
        "^.+\\.js$": "babel-jest",
    },

    // Module file extensions
    moduleFileExtensions: ["js", "json"],

    // Ignore patterns
    testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
};
