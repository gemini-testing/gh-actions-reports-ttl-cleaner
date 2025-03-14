import core from "@actions/core";
import fs from "node:fs";
import path from "node:path";
import { INPUT } from "./constants.js";
import { isDirectory } from "./fs-utils.js";

export const getValidatedReportPrefix = async (): Promise<string> => {
    const reportsPrefix = core.getInput(INPUT.HTML_REPORT_PREFIX);

    if (path.isAbsolute(reportsPrefix)) {
        throw new Error(`"${INPUT.HTML_REPORT_PREFIX}" should be relative path. Got "${reportsPrefix}"`);
    }

    if (!fs.existsSync(reportsPrefix)) {
        core.debug(`Stopping because directory ${reportsPrefix} does not exist`);
    }

    const isReportsDirectory = await isDirectory(reportsPrefix);

    if (!isReportsDirectory) {
        throw new Error(`"${INPUT.HTML_REPORT_PREFIX}" should be a directory path. Got "${reportsPrefix}"`);
    }

    core.debug(`Input ${INPUT.HTML_REPORT_PREFIX}: ${reportsPrefix}`);

    return reportsPrefix;
};

export const getValidatedTTL = (): number => {
    const ttl = core.getInput(INPUT.TTL);
    const ttlNumber = Number(ttl);

    if (Number.isNaN(ttlNumber)) {
        throw new Error(`"${INPUT.TTL}" should be a number. Got ${ttl}`);
    }

    if (ttlNumber <= 0) {
        throw new Error(`"${INPUT.TTL}" should be greater than zero. Got ${ttlNumber}`);
    }

    if (ttlNumber > 1000) {
        core.warning(`Input "${INPUT.TTL}" is ${ttlNumber} days, which seems too big`);
    }

    core.debug(`Input ${INPUT.TTL}: ${ttlNumber}`);

    return ttlNumber;
};

export const getValidatedBranch = (): string => {
    const branch = core.getInput(INPUT.BRANCH);

    if (!branch.trim()) {
        throw new Error(`Input "${INPUT.BRANCH}" value is empty`);
    }

    core.debug(`Input ${INPUT.BRANCH}: ${branch}`);

    return branch;
};

export const getValidatedUserName = (): string => {
    const userName = core.getInput(INPUT.USER_NAME);

    core.debug(`Input ${INPUT.USER_NAME}: ${userName}`);

    return userName;
};

export const getValidatedUserEmail = (): string => {
    const userEmail = core.getInput(INPUT.USER_EMAIL);

    core.debug(`Input ${INPUT.USER_EMAIL}: ${userEmail}`);

    return userEmail;
};
