import Api from "./api";

export default class dayApi extends Api {
  getAll = () => {
    return super.init().get(`getAllDays`);
  };
  getDaySchedules = () => {
    return super.init().get(`getAllDaySchedule`);
  };
  get = (id) => {
    return super.init().get(`getDay/${id}`);
  };

  getAvailableDays = () => {
    return super.init().get(`availableDays`);
  };

  // get = () => {
  //   return super.init().get(`getDay/:id`);
  // };
}