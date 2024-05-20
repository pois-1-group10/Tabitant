import React, { createContext, useState } from "react";
import { CompetitionAPI } from "../api/Competition";
import { Competition, CompetitionListParams } from "../types/award";

type CompetitionListContextType = {
  competitions: Competition[];
  loading: boolean;
  fetchCompetitions: (params: CompetitionListParams) => Promise<Competition[] | null>;
};

export const CompetitionListContext = createContext({} as CompetitionListContextType);

export const CompetitionListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCompetitions = async (params: CompetitionListParams) => {
    let competitionData: Competition[] | null = null;
    setLoading(true);
    try {
      competitionData = await CompetitionAPI.fetchCompetitionList(params);
      setCompetitions(competitionData);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    return competitionData;
  };

  return (
    <CompetitionListContext.Provider value={{ competitions, loading, fetchCompetitions }}>
      {children}
    </CompetitionListContext.Provider>
  );
};
