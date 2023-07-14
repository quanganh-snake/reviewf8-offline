// controllers/pushController.js
const { exec } = require("child_process");
const { logSuccess, logError, logInfo } = require("../views");

const buildList = () => {
  logInfo("Building data.json...");
  return new Promise((resolve, reject) => {
    const buildChild = exec("npm run create");

    buildChild.stdout.on("data", (data) => {
      logSuccess(data);
    });

    buildChild.stderr.on("data", (data) => {
      logInfo(data);
    });

    buildChild.on("error", (error) => {
      logError(error);
      reject(error);
    });

    buildChild.on("close", (code) => {
      if (code === 0) {
        logSuccess("Data.json build completed");
        resolve();
      } else {
        logError(`Data.json build failed with code ${code}`);
        reject(`Data.json build failed with code ${code}`);
      }
    });
  });
};

const pushGit = (text) => {
  logInfo("Pushing code to Git...");

  return new Promise((resolve, reject) => {
    const pushChild = exec(`git add . && git commit -m "${text}" && git push`);

    pushChild.stdout.on("data", (data) => {
      logSuccess(data);
    });

    pushChild.stderr.on("data", (data) => {
      logInfo(data);
    });

    pushChild.on("error", (error) => {
      logError(error);
      reject(error);
    });

    pushChild.on("close", (code) => {
      if (code === 0) {
        logSuccess("Git push completed");
        resolve();
      } else {
        logError(`Git push failed with code ${code}`);
        reject(`Git push failed with code ${code}`);
      }
    });
  });
};

const deployVercel = () => {
  logInfo("Deploying to Vercel...");

  return new Promise((resolve, reject) => {
    const vercelChild = exec("vercel --prod");

    vercelChild.stdout.on("data", (data) => {
      logSuccess(data);
    });

    vercelChild.stderr.on("data", (data) => {
      logInfo(data);
    });

    vercelChild.on("error", (error) => {
      logError(error);
      reject(error);
    });

    vercelChild.on("close", (code) => {
      if (code === 0) {
        logSuccess("Vercel deployment completed");
        resolve();
      } else {
        logError(`Vercel deployment failed with code ${code}`);
        reject(`Vercel deployment failed with code ${code}`);
      }
    });
  });
};

const buildPushAndDeploy = async (text) => {
  await buildList();
  await pushGit(text);
  await deployVercel();
};

module.exports = buildPushAndDeploy;
