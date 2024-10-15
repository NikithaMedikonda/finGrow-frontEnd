import React, { createContext, useState, ReactNode } from 'react';

interface User {
    username: string;
    password: string;
    totalIncome:number;
    balance:number
}

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    transactions: any;
    setTransactions : (transaction:any) => void;
    add: boolean;
    setAdd: (status:boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [add, setAdd] = useState<boolean>(false);

    return (
        <UserContext.Provider value={{ user, setUser, transactions, setTransactions, add, setAdd }}>
            {children}
        </UserContext.Provider>
    );
};