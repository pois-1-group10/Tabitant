import React, { createContext, useState } from "react";
import { User } from "../types/user";

type UserDetailContextType = {
    user?: User;
    loading: boolean;
    fetchUserDetail: (params: {}) => Promise<void>;
}

export const UserDetailContext = createContext({} as UserDetailContextType);

export const UserListProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User|undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserDetail = async () => {};

	return (
    <UserDetailContext.Provider value={{user, loading, fetchUserDetail}} >
			{ children }
		</UserDetailContext.Provider>
  )
};
