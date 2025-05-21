import antfu from "@antfu/eslint-config";
import nextPlugin from "@next/eslint-plugin-next";

export default antfu(
  {
    type: "app",
    react: true,
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ignores: [
      "**/generated/*",
      "**/instrumentation*",
    ],
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    rules: {
      "antfu/no-top-level-await": ["off"],
      "no-console": ["warn"],
      "node/no-process-env": ["error"],
      "node/prefer-global/process": ["off"],
      "perfectionist/sort-imports": ["error", {
        tsconfigRootDir: ".",
      }],
      "style/function-call-argument-newline": ["error", "consistent"],
      "ts/consistent-type-definitions": ["error", "type"],
      "ts/no-redeclare": "off",
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
    },
  },
);
