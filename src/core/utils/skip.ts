export function getSkipNumber(pageNumber: number, pageSize: number): number {
  return (pageNumber - 1) * pageSize;
}
