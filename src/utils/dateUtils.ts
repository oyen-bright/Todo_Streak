import { DateTime } from "../types/DateTimes";

// Function to convert day name to corresponding number

export function convertDayToNumber(day: string): number {
  // Map day names to numbers (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

  switch (day.toLowerCase()) {
    case "monday":
      return 1;
    case "tuesday":
      return 2;
    case "wednesday":
      return 3;
    case "thursday":
      return 4;
    case "friday":
      return 5;
    case "saturday":
      return 6;
    case "sunday":
      return 0;
    default:
      return 0;
  }
}

// Function to convert number to corresponding day name

export function convertNumberToDay(number: number): string {
  // Map numbers to day names (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

  switch (number) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 0:
      return "Sunday";
    default:
      return "";
  }
}

// Function to convert completed dates from DateTime format to array of objects with date and count

export function convertCompletedDates(completedDates: DateTime[]) {
  // Convert each completed date to an object with date and count properties

  return completedDates.map((completedDate) => {
    const [year, month, day] = completedDate.date.split("-").map(Number);
    return {
      date: new Date(year, month - 1, day),
      count: 1,
    };
  });
}

// Function to get start and end of the week for a given date

export function getStartAndEndOfWeek(date: Date): {
  startOfWeek: Date;
  endOfWeek: Date;
} {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);

  d.setDate(diff);
  const startOfWeek = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  d.setDate(d.getDate() + 6);
  const endOfWeek = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  return { startOfWeek, endOfWeek };
}

// Function to generate a unique key for the week based on its start and end dates

export const generateUniqueKeyForWeek = (
  startOfWeek: Date,
  endOfWeek: Date
): string => {
  const formatDate = (date: Date): string => {
    const day = padZeroes(date.getDate());
    const month = padZeroes(date.getMonth() + 1);
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const padZeroes = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  const startKey = formatDate(startOfWeek);
  const endKey = formatDate(endOfWeek);
  return `${startKey}-${endKey}`;
};

// Function to convert a date object to a formatted date and time string

export function convertDate(day: Date): { date: string; time: string } {
  const formattedDate = formatDate(day);
  const currentDate = new Date();

  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours || 12;
  const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;

  return { date: formattedDate, time: formattedTime };
}

// Function to get the unique key for the week containing a given date

export function getWeekKey(date: Date): string {
  const startEndOfWeek = getStartAndEndOfWeek(date);
  return generateUniqueKeyForWeek(
    startEndOfWeek.startOfWeek,
    startEndOfWeek.endOfWeek
  );
}

// Function to format a date object as a string in "YYYY-MM-DD" format

export const formatDate = (date: Date): string => {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
