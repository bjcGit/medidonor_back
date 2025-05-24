export function paginate(
  data: any[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    data,
    total,
    page,
    skip: (page - 1) * limit,
    limit,
  };
}