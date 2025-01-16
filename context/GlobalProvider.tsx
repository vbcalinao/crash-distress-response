import { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalContextType {
    name: string;
    setName: (name: string) => void;
    contact: string;
    setContact: (contact: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error(
            'useGlobalContext must be used within a GlobalProvider'
        );
    }
    return context;
};

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [name, setName] = useState<string>('');
    const [contact, setContact] = useState<string>('');

    return (
        <GlobalContext.Provider value={{ name, setName, contact, setContact }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
