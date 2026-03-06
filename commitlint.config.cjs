module.exports = {
  defaultIgnores: false,
  extends: ["@commitlint/config-conventional"],
  ignores: [message => /^Merge(?: branch| pull request)?/i.test(message)],
  rules: {
    "header-max-length": [2, "always", 100],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
};
