import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import axios from 'axios';

export const useToken = () => {
    const { isAuthenticated, getIdTokenClaims } = useAuth0();
    const [token, setToken] = useState('');
    React.useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        getIdTokenClaims()
            .then(claim => {
                const token = claim.__raw;
                setToken(token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            })
            .catch(console.error)
    }, [getIdTokenClaims, setToken, isAuthenticated]);
    return token;
}
