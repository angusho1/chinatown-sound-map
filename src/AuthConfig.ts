import { LogLevel } from "@azure/msal-browser";

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
        redirectUri: '/',
        postLogoutRedirectUri: '/',
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
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
// export const protectedResources = {
//     apiTodoList: {
//         endpoint: 'http://localhost:5000/api/todolist',
//         scopes: {
//             read: ['https://fabrikamb2c.onmicrosoft.com/TodoList/ToDoList.Read'],
//             write: ['https://fabrikamb2c.onmicrosoft.com/TodoList/ToDoList.ReadWrite'],
//         },
//     },
// };

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
*/
export const loginRequest = {
    scopes: [],
};