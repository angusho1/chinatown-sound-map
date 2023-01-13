import { ActionIcon, Autocomplete, AutocompleteItem, Chip, Space, Flex } from '@mantine/core';
import SoundRecordingTag from 'models/SoundRecordingTag.model';
import { IconPlus, IconX } from '@tabler/icons';
import './TagInput.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchTags, selectTags, selectGetTagsStatus } from 'features/submissions/submissionsSlice';
import { MAX_NUMBER_TAGS_PER_RECORDING } from 'utils/form-validators.utils';

interface TagInputProps {
    inputProps: any;
    autoCompleteProps: any;
    addTag(tag: SoundRecordingTag): void;
    removeTag(index: number): void;
    setAutoCompleteField(value: string): void;
}

export default function TagInput({ inputProps, autoCompleteProps, addTag, removeTag, setAutoCompleteField }: TagInputProps) {
    const dispatch = useAppDispatch();
    const tagsStatus = useAppSelector(selectGetTagsStatus);
    const existingTags = useAppSelector(selectTags);

    if (tagsStatus === 'idle') dispatch(fetchTags());

    const tags: SoundRecordingTag[] = inputProps.value;
    const autoCompleteItems: AutocompleteItem[] = existingTags
        .filter(tag => !tags.find(t => t.id === tag.id))
        .map(tag => {
        return {
            value: tag.name,
            id: tag.id,
            name: tag.name,
        }
    });

    const onAddTag = () => {
        if (autoCompleteProps.error || !/\S/.test(autoCompleteProps.value)) return;
        setAutoCompleteField('');
        addTag({ id: '', name: autoCompleteProps.value });
    }

    const onDropdownItemSelect = (item: AutocompleteItem) => {
        setAutoCompleteField('');
        addTag({ id: item.id, name: item.name });
    };

    const onFormKeyEvent = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            onAddTag();
        }
    }

    autoCompleteProps.error = autoCompleteProps.error || inputProps.error;

    return (
        <>
            <Autocomplete
                label="Tags"
                description={`Add up to ${MAX_NUMBER_TAGS_PER_RECORDING} tags to describe your recording.`}
                placeholder="Add Tags"
                data={autoCompleteItems}
                onItemSubmit={onDropdownItemSelect}
                onKeyDown={onFormKeyEvent}
                rightSection={(
                    <ActionIcon variant="subtle" onClick={onAddTag}>
                        <IconPlus size={16} />
                    </ActionIcon>
                )}
                {...autoCompleteProps}
            />

            <Space h="sm" />

            {tags.length > 0 && (
                <Chip.Group position="left">
                    {
                        tags.map((tag: SoundRecordingTag, index: number) =>
                            <Chip
                                key={index}
                                value={tag.name}
                                variant="filled"
                            >
                                <Flex>
                                    <ActionIcon variant="transparent" onClick={() => removeTag(index)}>
                                        <IconX size={12} />
                                    </ActionIcon>
                                    {tag.name}
                                </Flex>
                            </Chip>
                        )
                    }
                </Chip.Group>
            )}
        </>
    )
}
