import authReducer from "./reducers/authSlice";
import uiReducer from "./reducers/uiSlice";

export const rootSlices = {
    auth: authReducer,
    ui: uiReducer
}
