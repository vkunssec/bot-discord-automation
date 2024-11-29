module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [2, "always", ["feat", "feature", "fix", "docs", "style", "refactor", "test", "chore", "revert"]],
    },
};
