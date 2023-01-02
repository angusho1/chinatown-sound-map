import { useMsal } from "@azure/msal-react";
import { ActionIcon, Center, Flex, Loader, Spoiler, Table, Text, Tooltip } from "@mantine/core";
import { IconArrowBackUp, IconCheck, IconEye, IconX } from "@tabler/icons";
import { tokenRequest } from "AuthConfig";
import dayjs from "dayjs";
import { editSubmissionStatus, publishSubmission } from "features/submissions/submissionsAPI";
import Submission, { SubmissionStatus } from "models/Submission.model";
import { Fragment, useState } from "react";
import SubmissionModal, { SubmissionModalState } from "../submission-modal/SubmissionModal";

interface SubmissionsTableProps {
    submissions?: Submission[];
    statusFilter: SubmissionStatus;
    refreshSubmissions: () => void;
}

export default function SubmissionsTable({ submissions, statusFilter, refreshSubmissions }: SubmissionsTableProps) {
    const { instance } = useMsal();
    const [submissionModalState, setSubmissionModalState] = useState<SubmissionModalState>({
        opened: false,
        selectedSubmission: undefined,
    });

    const getToken = async () => {
        const tokenResult = await instance.acquireTokenSilent(tokenRequest);
        return tokenResult.accessToken;
    };

    if (!submissions) return (
        <Center h={200}>
            <Loader color={'pink'} />
        </Center>
    );

    const getSubmissionFilter = (statusFilter: SubmissionStatus) => (submission: Submission) => submission.status === statusFilter;

    const publish = async (submission: Submission) => {
        try {
            const token = await getToken();
            await publishSubmission(submission.id, token);
            refreshSubmissions();
        } catch (e) {
            console.log(e);
        }
    };

    const remove = async (submission: Submission) => {
        try {
            const token = await getToken();
            await editSubmissionStatus(submission.id, 'Rejected', token);
            refreshSubmissions();
        } catch (e) {
            console.log(e);
        }
    };

    const restore = async (submission: Submission) => {
        try {
            const token = await getToken();
            await editSubmissionStatus(submission.id, 'Pending', token);
            refreshSubmissions();
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

    const rows = submissions
        .filter(getSubmissionFilter(statusFilter))
        .map(submission => {
        return (
            <tr key={submission.id}>
                <td>{ dayjs(submission.dateCreated).format('LLL') }</td>
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
        <Fragment>
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
        </Fragment>
    )
}