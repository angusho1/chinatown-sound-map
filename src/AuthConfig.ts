import { LogLevel } from "@azure/msal-browser";
import { ADMIN_SIGN_IN_REDIRECT_URI, ADMIN_SIGN_OUT_REDIRECT_URI } from "constants/admin/admin.constants";

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
    names: {
        adminSignIn: process.env.REACT_APP_B2C_ADMIN_SIGN_IN_NAME as string,
    },
    authorities: {
        adminSignIn: {
            authority: process.env.REACT_APP_B2C_ADMIN_SIGN_IN_POLICY_AUTHORITY as string,
        },
    },
    authorityDomain: process.env.REACT_APP_B2C_AUTHORITY_DOMAIN as string,
};


/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_B2C_APP_CLIENT_ID as string,
        authority: b2cPolicies.authorities.adminSignIn.authority,
        knownAuthorities: [b2cPolicies.authorityDomain],
        redirectUri: ADMIN_SIGN_IN_REDIRECT_URI,
        postLogoutRedirectUri: ADMIN_SIGN_OUT_REDIRECT_URI,
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        piiLoggingEnabled: false,
        loggerOptions: {
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                if (process.env.NODE_ENV === 'production') return;
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
const apiUrl = process.env.REACT_APP_API_DOMAIN;
export const protectedResources = {
    submissions: {
        endpoint: `${apiUrl}/submissions`,
        scopes: {
            read: `${process.env.REACT_APP_API_TENANT}/${process.env.REACT_APP_API_URI}/submissions.read`,
        },
    },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
*/
export const loginRequest = {
    scopes: [],
};

export const tokenRequest = {
    scopes: [protectedResources.submissions.scopes.read],
};
