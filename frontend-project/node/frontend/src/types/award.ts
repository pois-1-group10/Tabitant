export type Competition = {
  id: number;
  year: number;
  month: number;
  prefecture: {
    id: number;
    name: string;
  };
};

export type Award = {
  id: number;
  compe: Competition;
	rank: number;
};
