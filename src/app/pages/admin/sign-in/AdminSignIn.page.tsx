import { UnauthenticatedTemplate, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Button, Container } from "@mantine/core";
import { loginRequest } from "AuthConfig";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignInPage() {
    const { instance } = useMsal();
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    
    useEffect(() => {
        if (isAuthenticated) navigate('/admin/dashboard');
        console.log('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    const signIn = async () => {
        try {
            await instance.loginRedirect(loginRequest);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Container py="xl">
            <UnauthenticatedTemplate>
                <Button onClick={signIn}>
                    Sign In
                </Button>
            </UnauthenticatedTemplate>
        </Container>
    );
}