import {PermissionAdapter} from "./types";
import React, { ReactNode} from "react";
import {AuthContext} from "./context";

interface AuthProviderProps {
    adapter: PermissionAdapter;
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({adapter,children, }) => {
    return (
        <AuthContext.Provider value={adapter}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
