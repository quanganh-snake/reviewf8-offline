const { exec } = require("child_process");
const { logSuccess, logError, logInfo } = require("../views");
const { runBuild } = require("../build");

const building = async () => {
  logInfo("Building...");
  const build = await runBuild();
  if (build) {
    return true;
  }
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
  try {
    const build = await building();
    setTimeout(async () => {
      logInfo("Wait for building...");
      if (build) {
        logSuccess("Building successfully!");
        await pushGit(text);
        logSuccess("Push git successfully!");
        await deployVercel();
        logSuccess("Deployed successfully!");
      }
    }, 2000);
  } catch {
    logError("Some thing went wrong!");
  }
};

module.exports = buildPushAndDeploy;
