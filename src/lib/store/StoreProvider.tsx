import React, { ReactNode } from "react";
import { Provider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {createStoreFactory} from "./factory";
import {StoreConfig} from "./types";
import {StoreContext} from "./context";


interface StoreProviderProps<Slices extends Record<string, any>> {
    config: StoreConfig<Slices>;
    children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps<any>> = <Slices extends Record<string, any>>({
                                                               config,
                                                               children,
                                                           }: StoreProviderProps<Slices>) => {


    const storedVersion = localStorage.getItem('sos_version');
    if (storedVersion !== config.keyName) {
        localStorage.clear(); // Borra el almacenamiento si hay una nueva versión
        localStorage.setItem('sos_version', config.keyName);
    }

    const storeInstance = createStoreFactory(config);

    return (
        <StoreContext.Provider value={storeInstance}>
            <Provider store={storeInstance.store}>
                <PersistGate loading={null} persistor={storeInstance.persist}>
                    {children}
                </PersistGate>
            </Provider>
        </StoreContext.Provider>
    );
};


export default StoreProvider;
