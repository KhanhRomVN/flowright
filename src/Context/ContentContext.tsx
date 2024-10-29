import React, { createContext, useState, useContext } from 'react';

export type ContentType = 'account' | 'card' | 'identify' | 'google' | 'clone' | 'note'

interface ContentContextType {
    currentTab: ContentType;
    currentId: number | null;
    setCurrentContent: (tab: ContentType, id: number | null) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTab, setCurrentTab] = useState<ContentType>('account');
    const [currentId, setCurrentId] = useState<number | null>(null);

    const setCurrentContent = (tab: ContentType, id: number | null) => {
        setCurrentTab(tab);
        setCurrentId(id);
    };

    return (
        <ContentContext.Provider value={{ currentTab, currentId, setCurrentContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};

