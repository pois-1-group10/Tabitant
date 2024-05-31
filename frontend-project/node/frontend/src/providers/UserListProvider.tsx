import React, { createContext, useState } from "react";
import { User, UserListParams } from "../types/user";
import { UserAPI } from "../api/User";

type UserListContextType = {
    users: User[];
    loading: boolean;
    fetchUsers: (params: {}) => Promise<void>;
}

export const UserListContext = createContext({} as UserListContextType);

export const UserListProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (params: UserListParams) => {
    setLoading(true)
    try {
      const users = await UserAPI.fetchUserList(params);
      setUsers(users);
    } catch(e) {
      console.log(e);
    }
    setLoading(false);
  };

	return (
    <UserListContext.Provider value={{users, loading, fetchUsers}} >
			{ children }
		</UserListContext.Provider>
  )
};
