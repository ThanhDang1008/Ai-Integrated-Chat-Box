export const formatTime = (time: number) => {
  let minutes = Math.floor(time / 60);
  let seconds = Math.round(time) % 60;
  if (time % 60 >= 0.5 && time % 60 !== 0 && Math.round(time) % 60 === 0)
    minutes++;
  if (seconds < 10) return `${minutes}:0${seconds}`;
  return `${minutes}:${seconds}`;
};

export const formatTime_hh_mm_ss = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const formatTime_yy_mm_dd = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0
  const year = String(date.getFullYear()).slice(-2); // Lấy hai chữ số cuối của năm
  return `${day}/${month}/${year}`;
};

export const formatISODate = (isoDateString: string) => {
  // //const isoDate = "2024-07-22T11:59:10.000Z";
  // const date = new Date(isoDateString);

  // // Các tùy chọn định dạng
  // const options = {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  //   hour: "numeric",
  //   minute: "numeric",
  //   second: "numeric",
  //   hour12: true,
  //   timeZone: "UTC",
  // };

  // // Định dạng ngày giờ
  // const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // // Chỉnh sửa định dạng để phù hợp yêu cầu
  // const finalFormattedDate = formattedDate
  //   .replace(", ", " at ")
  //   .replace(":00 ", " ");

  // return finalFormattedDate;

  const date = new Date(isoDateString);

  // Các tùy chọn định dạng
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // Sử dụng định dạng 24h
    timeZone: "Asia/Ho_Chi_Minh",
  } as Intl.DateTimeFormatOptions;

  // Định dạng ngày giờ theo tiếng Việt
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Trả về chuỗi đã định dạng
  return formattedDate;
};

export const convertToDesiredFormat = (isoDate: string) => {
  //const isoDate = "2024-11-25T14:04:57.000Z";
  const date = new Date(isoDate);

  // Chuyển đổi giờ UTC sang GMT+7
  //const offsetInMilliseconds = 7 * 60 * 60 * 1000; // GMT+7
  //số GMT+0 mặc định đã chuyển GMT+7
  const localTime = new Date(date.getTime());
  //console.log(localTime.getDay());

  // Định dạng các phần của ngày
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = daysOfWeek[localTime.getDay()]; //localTime.getDay() trả về số từ 0 đến 6
  const monthName = monthsOfYear[localTime.getMonth()]; //localTime.getMonth() trả về số từ 0 đến 11
  const day = localTime.getDate();
  const year = localTime.getFullYear();
  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  return `${dayName}, ${monthName} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
};

export const getFormattedDateTime = (isoDate: string) => {
  const date = new Date(isoDate);

  // Chuyển đổi giờ UTC sang GMT+7
  //const offsetInMilliseconds = 7 * 60 * 60 * 1000; // GMT+7
  //số GMT+0 mặc định đã chuyển GMT+7
  const localTime = new Date(date.getTime());

  // Lấy các thành phần của ngày và giờ
  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  const day = String(localTime.getDate()).padStart(2, "0");
  const month = String(localTime.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0
  const year = localTime.getFullYear();

  // Trả về định dạng yêu cầu
  return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
};
