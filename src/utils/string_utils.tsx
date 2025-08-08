export const numberToUSMoney = (value: number): string => {
    return value.toLocaleString('en-US');
};

export const capitalizeStr = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
