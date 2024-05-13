import React, { createContext, useState } from "react";
import { User } from "../types/user";

type UserListContextType = {
    users: User[];
    loading: boolean;
    fetchUsers: (params: {}) => Promise<void>;
}

export const UserListContext = createContext({} as UserListContextType);

export const UserListProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async () => {};

	return (
    <UserListContext.Provider value={{users, loading, fetchUsers}} >
			{ children }
		</UserListContext.Provider>
  )
};
