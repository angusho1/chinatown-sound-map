import { useMsal } from "@azure/msal-react";
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

    return (
        <Container py="xl">
            <Title>
                Dashboard
            </Title>
            <Button onClick={fetchSubmissions}>
                Get Submissions
            </Button>
        </Container>
    );
}