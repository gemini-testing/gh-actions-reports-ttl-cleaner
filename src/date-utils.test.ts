import { jest, expect } from "@jest/globals";
import { getDateUTCStringBeforeDays, looksLikeDate, isStringDateBefore } from "./date-utils.js";

describe("date-utils", () => {
    describe("getDateUTCStringBeforeDays", () => {
        it("should return the current date in UTC format YYYY-MM-DD, subtracting given amount of days", () => {
            const mockDate = new Date(Date.UTC(2010, 0, 10));
            const originalDate = globalThis.Date;

            jest.spyOn(global, "Date").mockImplementation((arg) => (arg ? new originalDate(arg) : mockDate));

            const dateString = getDateUTCStringBeforeDays(83);

            expect(dateString).toBe("2009-10-19");
        });
    });

    describe("looksLikeDate", () => {
        it("should return true if string is in dddd-dd-dd format", () => {
            expect(looksLikeDate("1234-56-78")).toBe(true);
        });

        it("should return false on length missmatch", () => {
            expect(looksLikeDate("1234-56-789")).toBe(false);
        });

        it("should return false on letters", () => {
            expect(looksLikeDate("1234-ab-789")).toBe(false);
        });
    });

    describe("isStringDateBefore", () => {
        it("should return true if first date is before the second one", () => {
            expect(isStringDateBefore("2009-10-19", "2010-01-11")).toBe(true);
        });

        it("should return false if first date is after the second one", () => {
            expect(isStringDateBefore("2010-01-11", "2009-10-19")).toBe(true);
        });
    });
});
