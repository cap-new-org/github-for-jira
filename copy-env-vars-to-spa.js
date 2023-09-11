/**
 * Please make sure you have these environment variables defined in you .env,
 * otherwise it won't be copied to spa
 */
const fs = require("fs");
require("dotenv").config();

const ENV_VARS_TO_BE_COPIED = [
	{ LAUNCHDARKLY_CLIENT_KEY: process.env.LAUNCHDARKLY_CLIENT_KEY },
	{ GLOBAL_HASH_SECRET: process.env.GLOBAL_HASH_SECRET }
];

let envVars = "";
ENV_VARS_TO_BE_COPIED.forEach(variable => {
	envVars += `REACT_APP_${Object.keys(variable)[0]}=${Object.values(variable)[0]} \n`;
});

fs.writeFileSync("spa/.env", envVars);

