module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  rules: {
    // Allow Tailwind v4 directives (non-standard CSS at-rules)
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "layer",
          "apply",
          "variants",
          "responsive",
          "screen",
          "theme",
        ],
      },
    ],
  },
};
