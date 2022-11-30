const baseUrl = process.env.REACT_APP_B2C_APP_REDIRECT_URI as string;

export const ADMIN_SIGN_IN_REDIRECT_URI = `${baseUrl}/admin/dashboard`;
export const ADMIN_SIGN_OUT_REDIRECT_URI = `${baseUrl}/`;