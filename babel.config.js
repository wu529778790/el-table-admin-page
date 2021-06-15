module.exports = {
  presets: [
    ["@vue/cli-plugin-babel/preset", { modules: false }],
    ["@vue/app", { useBuiltIns: "entry" }],
  ],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
};
