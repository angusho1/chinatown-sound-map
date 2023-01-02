export type SubmissionSortField = 'dateCreated' | 'title' | 'author';

export type SortColumn = {
    field: SubmissionSortField;
    reversed: boolean;
}

export type GetSubmissionsOptions = {
    sort?: SortColumn[];
}