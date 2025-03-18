import React, {useEffect, useMemo} from 'react';
import TagManager from "react-gtm-module";
import './i18n';
import AuthProvider from "./lib/auth/AuthProvider.tsx";
import {DataContextProvider, RealTimeContextProvider, ThemeProvider, useAppSelector, useStoreContext} from "./lib";
import AppRouter from "./lib/auth/components/app-router";
import routes from "./routes";
import {SupabaseDataAdapter} from "./adapters/supabase/SupabaseDataAdapter.ts";
import {SupabasePermissionAdapter} from "./adapters/supabase/SupabasePermissionAdapter.ts";
import {SupabaseRealtimeAdapter} from "./adapters/supabase/SupabaseRealtimeAdapter.ts";
const baseUrl = import.meta.env?.VITE_SUPABASE_URL ?? 'https://localhost';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY ?? 'any-key';

declare global {
    interface Window {
        dataLayer: any;
        deferredPrompt: any;
    }
}

const tagManagerArgs = {
    gtmId: 'GTM-587QLQB8'
}

const App: React.FC = () => {

    const storeContext = useStoreContext();
    const authUser = useAppSelector((state) => state.auth.authUser);

    useEffect(() => {
        TagManager.initialize(tagManagerArgs);
    }, []);

    const adapterData = useMemo(() => new SupabaseDataAdapter({
        baseURL: baseUrl,
        token: supabaseAnonKey,
        store: storeContext.store
    }), [baseUrl, storeContext.store]);

    const adapterRealtime = useMemo(() => new SupabaseRealtimeAdapter({
        baseURL: baseUrl,
        token: supabaseAnonKey
    }), [baseUrl, storeContext.store]);

    const adapterPermission = useMemo(() => new SupabasePermissionAdapter(authUser), [authUser]);

    return (
        <ThemeProvider>
            <AuthProvider adapter={adapterPermission}>
                <DataContextProvider adapter={adapterData}>
                    <RealTimeContextProvider adapter={adapterRealtime}>
                        <AppRouter routes={routes}/>
                    </RealTimeContextProvider>
                </DataContextProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;