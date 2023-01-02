import { useMsal } from "@azure/msal-react";
import { ActionIcon, Center, Flex, Loader, Spoiler, Table, Text, Tooltip } from "@mantine/core";
import { IconArrowBackUp, IconCheck, IconEye, IconX } from "@tabler/icons";
import { tokenRequest } from "AuthConfig";
import dayjs from "dayjs";
import { editSubmissionStatus, publishSubmission } from "features/submissions/submissionsAPI";
import Submission, { SubmissionStatus } from "models/Submission.model";
import { Fragment, useState } from "react";
import { SortColumn, SubmissionSortField } from "types/api/submissions-api.types";
import SubmissionModal, { SubmissionModalState } from "../submission-modal/SubmissionModal";
import SortButtonTh from "./SortButtonTh";

interface SubmissionsTableProps {
    submissions?: Submission[];
    statusFilter: SubmissionStatus;
    loading: boolean;
    refreshSubmissions: () => void;
    sort: SortColumn[];
    onSortChange: (sort: SortColumn[]) => void;
}

type ColumnSortState = {
    sorted: boolean;
    reversed: boolean;
    isPrimarySort: boolean;
}

export default function SubmissionsTable({ submissions, statusFilter, loading, refreshSubmissions, sort, onSortChange }: SubmissionsTableProps) {
    const { instance } = useMsal();
    const [submissionModalState, setSubmissionModalState] = useState<SubmissionModalState>({
        opened: false,
        selectedSubmission: undefined,
    });


    const getToken = async () => {
        const tokenResult = await instance.acquireTokenSilent(tokenRequest);
        return tokenResult.accessToken;
    };

    if (!submissions || loading) return (
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

    const getSortState = (field: SubmissionSortField): ColumnSortState => {
        const fieldIndex = sort.findIndex(col => col.field === field);

        if (fieldIndex === -1) return { sorted: false, reversed: false, isPrimarySort: false };
        else return { sorted: true, reversed: sort[fieldIndex].reversed, isPrimarySort: fieldIndex === 0 };
    };

    const updateSort = (field: SubmissionSortField) => {
        const i = sort.findIndex(col => col.field === field);
        let newSort: SortColumn[];
        if (i === -1) {
            newSort = ([{ field, reversed: false }] as SortColumn[]).concat(sort);
        } else if (sort[i].reversed) {
            newSort = sort.slice();
            newSort.splice(i, 1);
        } else {
            newSort = sort.slice();
            const fieldSort = newSort[i];
            fieldSort.reversed = true;
            if (i > 0) {
                newSort.splice(i, 1);
                newSort.unshift(fieldSort);
            }
        }
        onSortChange(newSort);
    };

    return (
        <Fragment>
            <Table
                fontSize="sm"
                horizontalSpacing="xl"
                striped
                highlightOnHover
                sx={{ tableLayout: 'fixed' }}
            >
                <thead>
                    <tr>
                        <SortButtonTh
                            {...getSortState('dateCreated')}
                            onSort={() => updateSort('dateCreated')}
                            width={200}
                        >
                            Date Submitted
                        </SortButtonTh>
                        <SortButtonTh
                            {...getSortState('title')}
                            onSort={() => updateSort('title')}
                            width={150}
                        >
                            Title
                        </SortButtonTh>
                        <th>Description</th>
                        <SortButtonTh
                            {...getSortState('author')}
                            onSort={() => updateSort('author')}
                            width={200}
                        >
                            Author
                        </SortButtonTh>
                        <th style={{ width: '80px' }}>Actions</th>
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