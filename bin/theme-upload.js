/* eslint-env node */
const brandId = process.env.BRAND_ID;
const { execSync } = require('child_process');

console.log("Starting theme upload process...");
console.log("Environment Variables:", process.env);

try {
    console.log("Running zcli themes:import command...");
    const output = execSync(
        `yarn --silent zcli themes:import --brandId=${process.env.BRAND_ID} --json`,
        { stdio: 'inherit' }
    );
    console.log("Command output:", output.toString());
} catch (err) {
    console.error("Command failed:", err.message);
    console.error("stderr:", err.stderr.toString());
    process.exit(1);
}

console.log("Uploading theme for brandId", brandId);

function zcli(command) {
  const data = execSync(`yarn --silent zcli ${command} --json`);
  return JSON.parse(data.toString());
}

const { themeId } = zcli(`themes:import --brandId=${brandId}`);

zcli(`themes:publish --themeId=${themeId}`);

const { themes } = zcli(`themes:list --brandId=${brandId}`);

for (const { live, id } of themes) {
  if (!live) zcli(`themes:delete --themeId=${id}`);
}
