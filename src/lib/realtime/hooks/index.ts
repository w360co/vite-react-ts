import {useContext} from "react";
import {RealtimeContext} from "../context";
import {RealtimeAdapter} from "../types";
import {RealtimeProvider} from "../provider";

export const useRealTime = () => {
    const context = useContext(RealtimeContext);
    if (!context) {
        throw new Error('useData must be used within a RealTimeProvider');
    }
    return context.adapter;
};

export const useRealTimeProvider = (adapter?: RealtimeAdapter) => {
    return new RealtimeProvider({
        adapter: adapter
    })
}
