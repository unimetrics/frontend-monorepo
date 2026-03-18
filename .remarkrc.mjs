import remarkMdx from "remark-mdx";
import remarkValidateLinks from "remark-validate-links";

const plugins = [
  [
    remarkValidateLinks,
    {
      skipPathPatterns: [/#top$/, /#!$/, /\/landing\/src\/data\/post\/landing\/[^#]+$/],
    },
  ],
];

if (process.env.REMARK_MDX === "1") {
  plugins.unshift(remarkMdx);
}

/** @type {import('unified').Settings} */
const config = {
  plugins,
};

export default config;
