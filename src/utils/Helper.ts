export const utils = {
  filterObject: (obj: any) => {
    if (!obj) return {};
    return Object.keys(obj).reduce((acc: any, key) => {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  },
};
