import React, { createContext, useState } from "react";
import { User } from "../types/user";
import { UserAPI } from "../api/User";
import { Emotion } from "../types/emo";

type SimilarUserContextType = {
  users: (User & Emotion)[];
  loading: boolean;
  fetchSimilarUsers: () => Promise<void>;
};

export const SimilarUserContext = createContext({} as SimilarUserContextType);

export const SimilarUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<(User & Emotion)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSimilarUsers = async () => {
    setLoading(true);
    try {
      const users = await UserAPI.fetchSimilarUserList();
      setUsers(users);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <SimilarUserContext.Provider value={{ users, loading, fetchSimilarUsers }}>
      {children}
    </SimilarUserContext.Provider>
  );
};
