import { createContext, useState, useEffect, useContext } from "react";
import { account } from "./appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        getUserOnLoad();
    }, []);

    const getUserOnLoad = async () => {
        try {
            const accountDetails = await account.get();
            setUser(accountDetails);
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        }
        setLoading(false);
    };

    const contextData = {
        user,
        loading,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
