const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");

const rootDir = path.resolve(process.argv[2]);

const sources = glob.sync("packages/**/src/*.js", { cwd: rootDir });

const getterRegex = /static get is\(\) {\s+return\s+'(.*)';\s+}/gm;
const elementNameRegex = /return\s+'(.*)';/;
const elements = [];

sources.forEach((sourceFile) => {
  const contents = fs.readFileSync(path.resolve(rootDir, sourceFile), "utf8");

  const getterMatches = contents.match(getterRegex);

  if (getterMatches) {
    getterMatches.forEach((getterMatch) => {
      const elementNameMatch = getterMatch.match(elementNameRegex);
      elements.push(elementNameMatch[1]);
    });
  }
});

console.log(JSON.stringify(elements, null, 2));
