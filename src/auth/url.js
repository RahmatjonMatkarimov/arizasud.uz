export const URL = "https://backend.arizasud.uz";
export const URL1 = "https://api.backend.arizasud.uz";

export const Timeee = (date) => {
  let years = date?.slice(0, 4)
  let month = date?.slice(5, 7)
  let day = date?.slice(8, 10)
  return `${day}.${month}.${years}`
}
