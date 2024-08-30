import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type User = {
    id:string
    name: string;
    email: string;
}

type UserContextType = {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({ id:'', name: '', email: '' });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
