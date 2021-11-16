const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");

const rootDir = path.resolve(process.argv[2]);

const sources = glob.sync("packages/**/src/*.js", { cwd: rootDir });

const partTableHeaderRegex = /\s*\*\sPart name\s*\|\s*Description/;
const stateTableHeaderRegex = /\s*\*\sAttribute\s*\|\s*Description/;
const partRegex = /\*(.*)\|(.*)/;

fs.removeSync(path.resolve("generated"));
fs.ensureDirSync(path.resolve("generated"));

const elementBlacklist = [
  "vaadin-chart-series",
  "vaadin-device-detector",
  "vaadin-infinite-scroller",
  "vaadin-iconset",
  "vaadin-template-renderer-grid-templatizer",
  "vaadin-template-renderer-templatizer",
];

function getElementWhitelist() {
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

  return elements.filter((element) => !elementBlacklist.includes(element));
}

const elementWhitelist = getElementWhitelist();

sources.forEach((sourceFile) => {
  const elementName = path.basename(sourceFile).replace(".js", "");
  const isLegacyPackage = sourceFile.indexOf('packages/vaadin-') >= 0;

  if (!elementWhitelist.includes(elementName) || isLegacyPackage) return;

  const contents = fs.readFileSync(path.resolve(rootDir, sourceFile), "utf8");
  const lines = contents.split("\n");

  const partTableStartLine = lines.findIndex((line) =>
    partTableHeaderRegex.test(line)
  );

  const parts = [];

  if (partTableStartLine >= 0) {
    let index = partTableStartLine + 2;

    while (lines[index].indexOf("|") >= 0) {
      const line = lines[index];
      const match = line.match(partRegex);
      const name = match[1].replace(/`/g, "").trim();
      const description = match[2].trim();
      parts.push({ name, description });
      index++;
    }
  }

  const stateTableStartLine = lines.findIndex((line) =>
    stateTableHeaderRegex.test(line)
  );

  const states = [];

  if (stateTableStartLine >= 0) {
    let index = stateTableStartLine + 2;

    while (lines[index].indexOf("|") >= 0) {
      const line = lines[index].trim();
      const columns = line.split("|");

      const attribute = columns[0].replace(/[`*]/g, "").trim();
      const description = columns[1].trim();
      const partName = columns[2]
        ? columns[2].replace(/[`*]/g, "").trim()
        : ":host";

      const state = { attribute, description, partName };
      states.push(state);
      index++;
    }
  }

  const metaData = {
    elementName,
    displayName: elementName,
    parts,
    states,
  };

  const targetFile = path.resolve("generated", elementName + ".json");
  fs.writeFileSync(targetFile, JSON.stringify(metaData, null, 2), "utf8");
});
