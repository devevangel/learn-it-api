module.exports = queryParam => {
  if (queryParam) {
    if (typeof queryParam === 'object') {
      ['gte', 'lte', 'lt', 'gt'].forEach(el => {
        if (el in queryParam) {
          queryParam[el] = Number(queryParam[el]);
        }
      });
    } else {
      queryParam = Number(queryParam);
    }
  }
  return queryParam;
};
