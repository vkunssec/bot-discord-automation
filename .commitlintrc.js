module.exports = {
    parserPreset: "conventional-changelog-conventionalcommits",
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [2, "always", ["feat", "feature", "fix", "docs", "style", "refactor", "test", "chore", "revert"]],
    },
};
