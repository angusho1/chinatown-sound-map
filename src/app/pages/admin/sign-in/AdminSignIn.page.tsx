import { useMsal } from "@azure/msal-react";
import { Button, Container } from "@mantine/core";
import { loginRequest } from "AuthConfig";


export default function AdminSignInPage() {
    const { instance } = useMsal();
    let activeAccount;

    if (instance) {
        activeAccount = instance.getActiveAccount();
    }

    const signIn = async () => {
        try {
            await instance.handleRedirectPromise();

            const accounts = instance.getAllAccounts();
            if (accounts.length === 0) {
                // No user signed in
                instance.loginRedirect(loginRequest);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Container py="xl">
            <Button onClick={signIn}>
                Sign In
            </Button>
        </Container>
    );
}