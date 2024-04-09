import globals from "globals"
import js from "@eslint/js"

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    js.configs.recommended,
    {
        languageOptions: {
            sourceType: "commonjs",
            globals: globals.node,
        },
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {
            sourceType: "module",
        },
    }
]
