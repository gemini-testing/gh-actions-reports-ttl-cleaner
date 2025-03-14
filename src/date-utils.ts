const msInSecond = 1000;
const secondsInMinute = 60;
const minutesInHour = 60;
const hoursInDay = 24;
const msInDay = hoursInDay * minutesInHour * secondsInMinute * msInSecond;

export const getDateUTCStringBeforeDays = (daysCount: number) => {
    const utcTimestampNow = Number(new Date());
    const utcTimestampBefore = utcTimestampNow - daysCount * msInDay;

    const dateBefore = new Date(utcTimestampBefore);

    const year = dateBefore.getUTCFullYear();
    const month = String(dateBefore.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateBefore.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const looksLikeDate = (str: string) => {
    const stringDateRegExp = /^\d{4}-\d{2}-\d{2}$/m;

    return stringDateRegExp.test(str);
};

/**
 * @returns true, if "beforeDate" is before "afterDate"
 */
export const isStringDateBefore = (beforeDate: string, afterDate: string): boolean => {
    return beforeDate.localeCompare(afterDate) < 0;
};
