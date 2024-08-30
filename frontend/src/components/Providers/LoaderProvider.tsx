import { createContext, useState, ReactNode, Dispatch, SetStateAction, useContext } from 'react';

type LoaderContextType = {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};
