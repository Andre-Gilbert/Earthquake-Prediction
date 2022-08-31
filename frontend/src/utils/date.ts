export const getDate = (currentDate: number, days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - days);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return year + '-' + month + '-' + day;
};
