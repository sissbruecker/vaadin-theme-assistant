const glob = require("glob");

const camelize = (s) => s.replace(/-./g, (x) => x.toUpperCase()[1]);

const datasets = glob.sync("../src/metadata/elements/*.json");

const imports = datasets
  .map((dataset) => dataset.replace("../src/metadata/elements/", ""))
  .map(
    (dataset) =>
      `import ${camelize(
        dataset.replace(".json", "")
      )} from "./elements/${dataset}"`
  );

console.log(imports.join("\n"));

const registrations = datasets
  .map((dataset) => dataset.replace("../src/metadata/elements/", ""))
  .map(
    (dataset) =>
      `registerMetaData(${camelize(
        dataset.replace(".json", "")
      )} as VaadinElementMetaData)`
  );

console.log(registrations.join("\n"));
