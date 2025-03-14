import core from "@actions/core";

import * as input from "./input.js";
import { gitCommit, gitConfigureAuthor, gitPush } from "./git-utils.js";
import { getNestedDirectories, removeDirectories } from "./fs-utils.js";
import { getDateUTCStringBeforeDays, isStringDateBefore, looksLikeDate } from "./date-utils.js";

async function main() {
    const userName = input.getValidatedUserName();
    const userEmail = input.getValidatedUserEmail();

    await gitConfigureAuthor(userName, userEmail);

    const reportsPrefix = await input.getValidatedReportPrefix();
    const ttl = input.getValidatedTTL();

    const removeOlderThanDate = getDateUTCStringBeforeDays(ttl);
    const nestedDirectories = await getNestedDirectories(reportsPrefix);
    const nestedDateLikeDirectories = nestedDirectories.filter(looksLikeDate);
    const nestedDirectoriesToRemove = nestedDateLikeDirectories.filter((directory) => {
        return isStringDateBefore(directory, removeOlderThanDate);
    });

    if (!nestedDirectoriesToRemove.length) {
        core.warning(`Nothing to remove: ${nestedDateLikeDirectories.length} nested directories are up-to-date`);
    } else {
        console.debug(`Removing ${nestedDirectoriesToRemove.length} directories inside ${reportsPrefix}`);
        await removeDirectories(reportsPrefix, nestedDirectoriesToRemove);

        await gitCommit(reportsPrefix);

        await gitPush();
    }
}

main().catch((error) => core.setFailed(error));
