const convertDate = (date: string | Date, includeTime = true) => {
  if (!date) return 'CORRUPTED';
  date = new Date(date);

  let minutes = String(date.getMinutes());
  let hours = String(date.getHours());

  let day = String(date.getDate());
  let month = String(date.getMonth() + 1);
  let year = String(date.getFullYear());

  if (Number(minutes) < 10) minutes = '0' + minutes;
  if (Number(hours) < 10) hours = '0' + hours;
  if (Number(day) < 10) day = '0' + day;
  if (Number(month) < 10) month = '0' + month;

  let fullDate: string;
  if (!includeTime) fullDate = `${day}.${month}.${year.slice(2)}`;
  else fullDate = `${day}.${month}.${year.slice(2)} ${hours}:${minutes}`;

  return fullDate;
};

export default convertDate;
