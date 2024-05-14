import React, { createContext, useState } from "react";
import { DetailUser } from "../types/user";
import { useParams } from "react-router-dom";
import { UserAPI } from "../api/User";

type UserDetailContextType = {
    user?: DetailUser;
    loading: boolean;
    fetchUserDetail: () => Promise<void>;
}

export const UserDetailContext = createContext({} as UserDetailContextType);

export const UserDetailProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DetailUser|undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const userId = params.id;

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const userData = await UserAPI.fetchUserDetail(Number(userId));
      setUser(userData);
    } catch(e) {
      console.log(e);
    }
    setLoading(false);
  };

	return (
    <UserDetailContext.Provider value={{user, loading, fetchUserDetail}} >
			{ children }
		</UserDetailContext.Provider>
  )
};
