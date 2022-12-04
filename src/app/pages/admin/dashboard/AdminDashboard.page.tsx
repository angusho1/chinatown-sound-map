import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { Button, Container, Title } from "@mantine/core";
import { tokenRequest } from "AuthConfig";
import { getSubmissions } from "features/submissions/submissionsAPI";

export default function AdminDashboardPage() {
    const { instance } = useMsal();

    const fetchSubmissions = async () => {
        try {
            const tokenResult = await instance.acquireTokenSilent(tokenRequest);
            console.log(tokenResult);
            const res = await getSubmissions(tokenResult.accessToken);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };

    const signOut = () => {
        instance.logoutRedirect();
    };

    return (
        <Container py="xl">
            <AuthenticatedTemplate>
                <Title>
                    Dashboard
                </Title>
                <Container>
                    <Button onClick={fetchSubmissions}>
                        Get Submissions
                    </Button>
                    <Button onClick={signOut}>
                        Sign Out
                    </Button>
                </Container>
            </AuthenticatedTemplate>
        </Container>
    );
}