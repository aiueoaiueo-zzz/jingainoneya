import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // 記事（content/articles/*.mdx）を読み込めるようにする
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    // 記事の先頭の前付け（--- で囲んだ部分）を本文として表示しない
    remarkPlugins: [["remark-frontmatter", ["yaml"]]],
  },
});

export default withMDX(nextConfig);
