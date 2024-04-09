const globals = require("globals")
const js = require("@eslint/js")

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            sourceType: "commonjs",
            globals: globals.node,
        },
    },
]
