import { Award } from "../types/award";

export const awardToString = (award: Award): string => {
  return (
    award.compe.year +
    "年" +
    award.compe.month +
    "月" +
    award.compe.prefecture.name +
    "大会 " +
    award.rank +
    "位"
  );
};
