import { AuthenticatedTemplate, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Badge, Button, Container, Spoiler, Stack, Table, Tabs, Title } from "@mantine/core";
import { IconDots, IconEye, IconTrash } from "@tabler/icons";
import { tokenRequest } from "AuthConfig";
import { getSubmissions } from "features/submissions/submissionsAPI";
import Submission, { SubmissionStatus } from "models/Submission.model";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PUBLISHED_SUBMISSIONS_TAB_NAME = 'Published';
const PENDING_SUBMISSIONS_TAB_NAME = 'Pending';
const REJECTED_SUBMISSIONS_TAB_NAME = 'Removed';

const PUBLISHED_SUBMISSIONS_TAB_ID = PUBLISHED_SUBMISSIONS_TAB_NAME.toLowerCase();
const PENDING_SUBMISSIONS_TAB_ID = PENDING_SUBMISSIONS_TAB_NAME.toLowerCase();
const REJECTED_SUBMISSIONS_TAB_ID = REJECTED_SUBMISSIONS_TAB_NAME.toLowerCase();

export default function AdminSubmissionsPage() {
    const { instance } = useMsal();
    const { tab } = useParams();
    const navigate = useNavigate();
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

    const currentTab = tab ? tab : PENDING_SUBMISSIONS_TAB_ID;

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
                </Stack>
                <Tabs value={currentTab} onTabChange={(value) => navigate(`/admin/submissions/${value}`)}>
                    <Tabs.List>
                        <Tabs.Tab
                            value={PUBLISHED_SUBMISSIONS_TAB_ID}
                            icon={<IconEye size={14} />}
                        >
                            {PUBLISHED_SUBMISSIONS_TAB_NAME}
                        </Tabs.Tab>
                        <Tabs.Tab
                            value={PENDING_SUBMISSIONS_TAB_ID}
                            icon={<IconDots size={14} />}
                            rightSection={
                                <Badge
                                    sx={{ width: 18, height: 18, pointerEvents: 'none' }}
                                    variant="filled"
                                    size="xs"
                                    p={0}
                                >
                                    {getSubmissionCount('Pending')}
                                </Badge>
                            }
                        >
                            {PENDING_SUBMISSIONS_TAB_NAME}
                        </Tabs.Tab>
                        <Tabs.Tab
                            value={REJECTED_SUBMISSIONS_TAB_ID}
                            icon={<IconTrash size={14} />}
                        >
                            {REJECTED_SUBMISSIONS_TAB_NAME}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={PUBLISHED_SUBMISSIONS_TAB_ID} pt="xs">
                        <Container sx={tableContainerStyles}>
                            <Title mb="lg" order={3}>
                                {PUBLISHED_SUBMISSIONS_TAB_NAME} { submissions ? `(${getSubmissionCount('Approved')})` : '' }
                            </Title>
                            { renderSubmissionsTable('Approved') }
                        </Container>
                    </Tabs.Panel>
                    <Tabs.Panel value={PENDING_SUBMISSIONS_TAB_ID} pt="xs">
                        <Container sx={tableContainerStyles}>
                            <Title mb="lg" order={3}>
                                {PENDING_SUBMISSIONS_TAB_NAME} { submissions ? `(${getSubmissionCount('Pending')})` : '' }
                            </Title>
                            { renderSubmissionsTable('Pending') }
                        </Container>
                    </Tabs.Panel>
                    <Tabs.Panel value={REJECTED_SUBMISSIONS_TAB_ID} pt="xs">
                        <Container sx={tableContainerStyles}>
                            <Title mb="lg" order={3}>
                                {REJECTED_SUBMISSIONS_TAB_NAME} { submissions ? `(${getSubmissionCount('Rejected')})` : '' }
                            </Title>
                            { renderSubmissionsTable('Rejected') }
                        </Container>
                    </Tabs.Panel>
                </Tabs>
            </AuthenticatedTemplate>
        </Container>
    );
}

const tableContainerStyles = {
    width: '100%',
    marginTop: '1rem',
    marginBottom: '2rem',
}