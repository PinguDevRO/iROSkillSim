import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type ComparizonType = "greater" | "less"

export const formatDate = (utcString: string) => {
  return dayjs.utc(utcString).local().format('YYYY/MM/DD HH:mm');
};

export const compareDateNow = (stringDate: string, kind: ComparizonType): boolean => {
  const dtNow = dayjs();
  const dtTarget = dayjs(stringDate);
  if(kind === 'greater'){
    return dtNow.isAfter(dtTarget);
  }
  else if(kind === 'less'){
    return dtNow.isBefore(dtTarget);
  }
  else{
    return false;
  }
};

export const isoStringToDate = (stringDate: string): Date => {
  return dayjs(stringDate).toDate();
};

export const isoStringToFormat = (stringDate: string, format: string): string => {
  return dayjs(stringDate).format(format);
};

export const getCurrentDate = (): Date => {
  return dayjs().toDate();
};

export const convertUTCtoPDT = (dt: string): string => {
  return dayjs.utc(dt).tz("America/Los_Angeles").format("MMMM D, YYYY h:mm A");
};
