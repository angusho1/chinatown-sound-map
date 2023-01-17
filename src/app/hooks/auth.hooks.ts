import { useMsal } from "@azure/msal-react";
import { tokenRequest } from "AuthConfig";
import { useEffect, useState } from "react";

export const useAccessToken = () => {
    const { instance } = useMsal();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        instance.acquireTokenSilent(tokenRequest)
            .then(tokenResult => setToken(tokenResult.accessToken))
            .catch(() => {});
    });

    return token;
};