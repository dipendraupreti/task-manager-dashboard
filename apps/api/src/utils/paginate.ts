export const meta = (total: number, page: number, limit: number) => {
  const pages = Math.ceil(total / limit);

  return { total, page, limit, pages };
};
