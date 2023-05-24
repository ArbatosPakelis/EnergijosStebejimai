import Api from "./api";

export default class accommodationApi extends Api {
  getAllAccommendation = () => {
    return super.init().get(`getAllAccommendation`);
  };
  getAccommendation = (id) => {
    return super.init().get(`getAccommendation/${id}`);
  };
  getAllDevices = (id) => {
    return super.init().get(`getAllDevices/${id}`);
  };
  getAllWarnings = (id) => {
    return super.init().get(`getAllWarnings/${id}`);
  };
  getSeenWarnings = (id) => {
    return super.init().get(`getSeenWarnings/${id}`);
  };
  getDevice = (id) => {
    return super.init().get(`getDevice/${id}`);
  };
  getAllWeeks = (id) => {
    return super.init().get(`getAllWeeks/${id}`);
  };
  getSchedule = (id) => {
    return super.init().get(`getSchedule/${id}`);
  };
  getAllTime = () => {
    return super.init().get(`times`);
  };
  newPatalpa = (pavadinimas, atsakingo_asmens_vardas, atsakingo_asmens_pavarde, atsakingo_asmens_kontaktas, kompiuteriu_kiekis, energijos_riba_per_zmogu, min_energija_ispejimui, asmeniniai_prietaisai) => {
    return super.init().post(`newPatalpa?pavadinimas=${pavadinimas}&atsakingo_asmens_vardas=${atsakingo_asmens_vardas}&atsakingo_asmens_pavarde=${atsakingo_asmens_pavarde}&atsakingo_asmens_kontaktas=${atsakingo_asmens_kontaktas}&kompiuteriu_kiekis=${kompiuteriu_kiekis}&energijos_riba_per_zmogu=${energijos_riba_per_zmogu}&min_energija_ispejimui=${min_energija_ispejimui}&asmeniniai_prietaisai=${asmeniniai_prietaisai}`);
  };
  getAccommodationTimes = (id) => {
    return super.init().get(`getAccommodationTimes?id=${id}`);
  };
}