import { AuthenticatedTemplate, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Button, Container, Spoiler, Stack, Table, Title } from "@mantine/core";
import { tokenRequest } from "AuthConfig";
import { getSubmissions } from "features/submissions/submissionsAPI";
import Submission, { SubmissionStatus } from "models/Submission.model";
import { useEffect, useState } from "react";

export default function AdminSubmissionsPage() {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [submissions, setSubmissions] = useState<Submission[]>();

    useEffect(() => {
        if (isAuthenticated) fetchSubmissions();
    }, [isAuthenticated]);

    const fetchSubmissions = async () => {
        try {
            const tokenResult = await instance.acquireTokenSilent(tokenRequest);
            console.log(tokenResult);
            const res = await getSubmissions(tokenResult.accessToken);
            setSubmissions(res);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };

    const signOut = () => {
        instance.logoutRedirect();
    };

    const getSubmissionFilter = (statusFilter: SubmissionStatus) => (submission: Submission) => submission.status === statusFilter;

    const renderSubmissionsTable = (statusFilter: SubmissionStatus) => {
        if (!submissions) return null;

        const rows = submissions
            .filter(getSubmissionFilter(statusFilter))
            .map(submission => {
            return (
                <tr key={submission.id}>
                    <td>{ submission.dateCreated.toUTCString() }</td>
                    <td>{ submission.soundRecording.title }</td>
                    <td>
                        <Spoiler
                            maxHeight={70}
                            showLabel="Show more"
                            hideLabel="Hide"
                        >
                            { submission.soundRecording.description }
                        </Spoiler>
                    </td>
                    <td>{ submission.email }</td>
                    <td>{ submission.soundRecording.author }</td>
                </tr>
            );
        });

        return (            
            <Table
                fontSize="sm"
                horizontalSpacing="xl"
                striped
                highlightOnHover
            >
                <thead>
                    <tr>
                        <th>Date Submitted</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Email</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody>
                    { rows }
                </tbody>
            </Table>
        )
    };

    const getSubmissionCount = (statusFilter: SubmissionStatus): number => {
        if (!submissions) return 0;
        return submissions.filter(getSubmissionFilter(statusFilter)).length;
    };

    return (
        <Container py="xl" sx={{ height: '100%' }}>
            <AuthenticatedTemplate>
                <Title>
                    Submissions
                </Title>
                <Stack align="start">
                    <Container>
                        <Button onClick={signOut}>
                            Sign Out
                        </Button>
                    </Container>
                    <Container sx={tableContainerStyles}>
                        <Title mb="lg" order={3}>
                            Pending { submissions ? `(${getSubmissionCount('Pending')})` : '' }
                        </Title>
                        { renderSubmissionsTable('Pending') }
                    </Container>
                    <Container sx={tableContainerStyles}>
                        <Title mb="lg" order={3}>
                            Published { submissions ? `(${getSubmissionCount('Approved')})` : '' }
                        </Title>
                        { renderSubmissionsTable('Approved') }
                    </Container>
                </Stack>
            </AuthenticatedTemplate>
        </Container>
    );
}

const tableContainerStyles = {
    width: '100%',
    marginBottom: '2rem',
}