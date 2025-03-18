import React from 'react';
import {DataAdapter} from "./types";
import {DataContext} from "./context";


interface DataProviderProps {
    adapter: DataAdapter;
    children: React.ReactNode;
}

export const DataContextProvider: React.FC<DataProviderProps> = ({ adapter, children }) => {
    return (
        <DataContext.Provider value={{ adapter }}>
            {children}
        </DataContext.Provider>
    );
};

DataContextProvider.displayName = "DataProvider";


