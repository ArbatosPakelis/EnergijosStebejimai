import Api from "./api";

export default class dayApi extends Api {
  getAll = () => {
    return super.init().get(`getAllDays`);
  };
  // siapsau
  // get = () => {
  //   return super.init().get(`getDay/:id`);
  // };
}