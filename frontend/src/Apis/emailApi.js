import Api from "./api";

export default class emailApi extends Api {
  get = () => {
    return super.init().get(`email`);
  };

  upateEmail = (emailAddr) => {
    return super.init().put(`email`, {email: emailAddr});
  };
}