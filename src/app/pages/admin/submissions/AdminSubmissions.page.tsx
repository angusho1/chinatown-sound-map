import { AuthenticatedTemplate, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { ActionIcon, Badge, Center, Container, Flex, Loader, Spoiler, Table, Tabs, Text, Title, Tooltip } from "@mantine/core";
import { IconArrowBackUp, IconCheck, IconDots, IconEye, IconTrash, IconX } from "@tabler/icons";
import { tokenRequest } from "AuthConfig";
import { getSubmissions, publishSubmission, editSubmissionStatus } from "features/submissions/submissionsAPI";
import Submission, { SubmissionStatus } from "models/Submission.model";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmissionModal, { SubmissionModalState } from "./SubmissionModal";

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
    const [submissionModalState, setSubmissionModalState] = useState<SubmissionModalState>({
        opened: false,
        selectedSubmission: undefined,
    });

    useEffect(() => {
        if (isAuthenticated) fetchSubmissions();
    }, [isAuthenticated]);

    const getToken = () => instance.acquireTokenSilent(tokenRequest);

    const fetchSubmissions = async () => {
        try {
            const tokenResult = await getToken();
            const res = await getSubmissions(tokenResult.accessToken);
            setSubmissions(res);
        } catch (e) {
            console.log(e);
        }
    };

    const getSubmissionFilter = (statusFilter: SubmissionStatus) => (submission: Submission) => submission.status === statusFilter;

    const publish = async (submission: Submission) => {
        try {
            const tokenResult = await getToken();
            await publishSubmission(submission.id, tokenResult.accessToken);
            fetchSubmissions();
        } catch (e) {
            console.log(e);
        }
    };

    const remove = async (submission: Submission) => {
        try {
            const tokenResult = await getToken();
            await editSubmissionStatus(submission.id, 'Rejected', tokenResult.accessToken);
            fetchSubmissions();
        } catch (e) {
            console.log(e);
        }
    };

    const restore = async (submission: Submission) => {
        try {
            const tokenResult = await getToken();
            await editSubmissionStatus(submission.id, 'Pending', tokenResult.accessToken);
            fetchSubmissions();
        } catch (e) {
            console.log(e);
        }
    }

    const viewSubmission = (submission: Submission) => {
        setSubmissionModalState({
            opened: true,
            selectedSubmission: submission,
        });
    };

    const renderSubmissionsTable = (statusFilter: SubmissionStatus) => {
        if (!submissions) return (
            <Center h={200}>
                <Loader color={'pink'} />
            </Center>
        );

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
                    <td>
                        <Text>{ submission.soundRecording.author }</Text>
                        <Text>{ submission.email }</Text>
                    </td>
                    <td>
                        <Flex justify={{ sm: 'center' }}>
                            <Tooltip label="View Submission">
                                <ActionIcon onClick={() => viewSubmission(submission)} color="gray">
                                    <IconEye size={20} />
                                </ActionIcon>
                            </Tooltip>
                            { statusFilter === 'Pending' && (
                                <Tooltip label="Publish">
                                    <ActionIcon onClick={() => publish(submission)} color="green">
                                        <IconCheck size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                            { (statusFilter === 'Approved' || statusFilter === 'Pending') && (
                                <Tooltip label="Remove">
                                    <ActionIcon onClick={() => remove(submission)} color="red">
                                        <IconX size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                            { statusFilter === 'Rejected' && (
                                <Tooltip label="Restore">
                                    <ActionIcon onClick={() => restore(submission)} color="gray">
                                        <IconArrowBackUp size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </Flex>
                    </td>
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
                        <th>Author</th>
                        <th>Actions</th>
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
                <Tabs
                    mt={20}
                    value={currentTab}
                    onTabChange={(value) => navigate(`/admin/submissions/${value}`)}
                >
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
                            rightSection={ getSubmissionCount('Pending') > 0 &&
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

                { submissionModalState.selectedSubmission && (
                    <SubmissionModal
                        submission={submissionModalState.selectedSubmission}
                        opened={submissionModalState.opened}
                        onClose={() => setSubmissionModalState({
                            opened: false,
                            selectedSubmission: submissionModalState.selectedSubmission,
                        })}
                        getToken={getToken}
                    />
                )}
            </AuthenticatedTemplate>
        </Container>
    );
}

const tableContainerStyles = {
    width: '100%',
    marginTop: '1rem',
    marginBottom: '2rem',
};