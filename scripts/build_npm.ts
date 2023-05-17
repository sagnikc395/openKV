// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./openKV.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@sagnikc395/openKV",
    version: Deno.args[0],
    description: "an open source kv store for the rest of us",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/sagnikc395/openKV.git",
    },
    bugs: {
      url: "https://github.com/sagnikc395/openKV/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests

    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
