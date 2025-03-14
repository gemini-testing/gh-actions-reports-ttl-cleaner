import io from "@actions/io";

import fs from "node:fs";
import path from "node:path";

export async function isDirectory(dirPath: string): Promise<boolean> {
    return fs.promises
        .stat(dirPath)
        .then((stats) => stats.isDirectory())
        .catch(() => false);
}

export async function getNestedDirectories(dirPath: string): Promise<string[]> {
    try {
        const contents = await fs.promises.readdir(dirPath);
        const directories: string[] = [];

        await Promise.all(
            contents.map(async (file) => {
                const filePath = path.join(dirPath, file);
                const stats = await fs.promises.stat(filePath);

                if (stats.isDirectory()) {
                    directories.push(file);
                }
            }),
        );

        return directories;
    } catch (error) {
        if ((error as { code: string }).code === "ENOENT") {
            return [];
        }

        throw error;
    }
}

export async function removeDirectories(parentDirectory: string, nestedDirectories: string[]): Promise<void> {
    const directoriesToRemove = nestedDirectories.map((nestedDirectory) => {
        return path.resolve(parentDirectory, nestedDirectory);
    });

    await Promise.all(directoriesToRemove.map((directory) => io.rmRF(directory)));
}
