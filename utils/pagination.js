const countNumberPage = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const countPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;

  return { totalItems, users, currentPage };
};

module.exports = { countNumberPage, countPagingData };
