import { AuthenticatedTemplate, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Badge, Container, Tabs, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { IconDots, IconEye, IconTrash } from "@tabler/icons";
import { tokenRequest } from "AuthConfig";
import { getSubmissions } from "features/submissions/submissionsAPI";
import Submission, { SubmissionStatus } from "models/Submission.model";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmissionModal, { SubmissionModalState } from "../../../components/submission-modal/SubmissionModal";
import SubmissionsTable from "app/components/submissions-table/SubmissionsTable";
import { SortColumn } from "types/api/submissions-api.types";

const PUBLISHED_SUBMISSIONS_TAB_NAME = 'Published';
const PENDING_SUBMISSIONS_TAB_NAME = 'Pending';
const REJECTED_SUBMISSIONS_TAB_NAME = 'Removed';

const PUBLISHED_SUBMISSIONS_TAB_ID = PUBLISHED_SUBMISSIONS_TAB_NAME.toLowerCase();
const PENDING_SUBMISSIONS_TAB_ID = PENDING_SUBMISSIONS_TAB_NAME.toLowerCase();
const REJECTED_SUBMISSIONS_TAB_ID = REJECTED_SUBMISSIONS_TAB_NAME.toLowerCase();

dayjs.extend(localizedFormat);

export default function AdminSubmissionsPage() {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const { tab } = useParams();
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState<Submission[]>();
    const defaultSort: SortColumn[] = [{ field: 'dateCreated', reversed: true }];
    const [sort, setSort] = useState<SortColumn[]>(defaultSort);
    const [loading, setLoading] = useState<boolean>(true);

    const [submissionModalState, setSubmissionModalState] = useState<SubmissionModalState>({
        opened: false,
        selectedSubmission: undefined,
    });

    const { height } = useViewportSize();

    useEffect(() => {
        if (isAuthenticated) fetchSubmissions();
    }, [isAuthenticated]);

    useEffect(() => {
        if (!loading) fetchSubmissions();
    }, [sort]);

    const getToken = () => instance.acquireTokenSilent(tokenRequest);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const tokenResult = await getToken();
            const res = await getSubmissions(tokenResult.accessToken, { sort });
            setSubmissions(res);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const getSubmissionFilter = (statusFilter: SubmissionStatus) => (submission: Submission) => submission.status === statusFilter;

    const getSubmissionCount = (statusFilter: SubmissionStatus): number => {
        if (!submissions) return 0;
        return submissions.filter(getSubmissionFilter(statusFilter)).length;
    };

    const currentTab = tab ? tab : PENDING_SUBMISSIONS_TAB_ID;

    return (
        <Container py="xl" sx={{ minHeight: height-120 }}>
            <AuthenticatedTemplate>
                <Title>
                    Submissions
                </Title>
                <Tabs
                    mt={20}
                    value={currentTab}
                    onTabChange={(value) => {
                        navigate(`/admin/submissions/${value}`);
                    }}
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
                            <SubmissionsTable
                                submissions={submissions}
                                loading={loading}
                                statusFilter={'Approved'}
                                refreshSubmissions={fetchSubmissions}
                                sort={sort}
                                onSortChange={setSort}
                            />
                        </Container>
                    </Tabs.Panel>
                    <Tabs.Panel value={PENDING_SUBMISSIONS_TAB_ID} pt="xs">
                        <Container sx={tableContainerStyles}>
                            <Title mb="lg" order={3}>
                                {PENDING_SUBMISSIONS_TAB_NAME} { submissions ? `(${getSubmissionCount('Pending')})` : '' }
                            </Title>
                            <SubmissionsTable
                                submissions={submissions}
                                loading={loading}
                                statusFilter={'Pending'}
                                refreshSubmissions={fetchSubmissions}
                                sort={sort}
                                onSortChange={setSort}
                            />
                        </Container>
                    </Tabs.Panel>
                    <Tabs.Panel value={REJECTED_SUBMISSIONS_TAB_ID} pt="xs">
                        <Container sx={tableContainerStyles}>
                            <Title mb="lg" order={3}>
                                {REJECTED_SUBMISSIONS_TAB_NAME} { submissions ? `(${getSubmissionCount('Rejected')})` : '' }
                            </Title>
                            <SubmissionsTable
                                submissions={submissions}
                                loading={loading}
                                statusFilter={'Rejected'}
                                refreshSubmissions={fetchSubmissions}
                                sort={sort}
                                onSortChange={setSort}
                            />
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