export const isDateWithinDays = (updatedAt:string, start:number, end:number) => {
  //start và end là số ngày
  const updatedDate = Date.parse(updatedAt);
  //console.log("updatedDate", updatedDate);
  const currentDate = Date.now();
  //console.log("currentDate", currentDate);
  let differenceInTime
  if (updatedDate > currentDate) {
    differenceInTime = updatedDate - currentDate;
  } else {
    differenceInTime = currentDate - updatedDate;
  }
  //console.log("differenceInTime", differenceInTime);
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  //console.log("differenceInDays", differenceInDays);

  return differenceInDays > start && differenceInDays <= end;
};
