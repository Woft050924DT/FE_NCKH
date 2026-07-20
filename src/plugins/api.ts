import axios from './axios';
import qs from 'qs';

const filterObject = (obj: any) => {
  const filtered: any = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      filtered[key] = obj[key];
    }
  }
  return filtered;
};

export const APIHelper = (api: string) => ({
  search: (params: any, option?: any) => axios.get(api, { params: filterObject(params), ...option }),
  count: (params: any, option?: any) => axios.get(api + 'count', { params: filterObject(params), ...option }),
  fetch: (params: any, option?: any) => axios.get(api, { params: filterObject(params), ...option }),
  fetchOne: (id: string | number, option?: any) => axios.get(api + id, option),
  create: (params: any, options?: any) => axios.post(api, filterObject(params), options),
  update: (id: string | number, params: any, option?: any) => axios.put(api + id, params, option),
  remove: (id: string | number, option?: any) => axios.delete(api + id, option),
  fetchRaw: (params: any) => axios.get(api, { params }),

  qsFetch: (params: any) => {
    const query = qs.stringify(filterObject(params));
    return axios.get(${api}?);
  },
});

export const APIRespository = APIHelper;
