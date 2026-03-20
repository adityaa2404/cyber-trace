import dayjs from "dayjs";

export function formatDateTime(dt: string | Date): string {
  return dayjs(dt).format("YYYY-MM-DD HH:mm");
}

export function formatDate(dt: string | Date): string {
  return dayjs(dt).format("YYYY-MM-DD");
}
