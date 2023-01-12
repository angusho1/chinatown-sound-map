import { ActionIcon, Autocomplete, AutocompleteItem, Chip, Space, Flex } from '@mantine/core';
import SoundRecordingTag from 'models/SoundRecordingTag.model';
import { IconPlus, IconX } from '@tabler/icons';
import './TagInput.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchTags, selectTags, selectGetTagsStatus } from 'features/submissions/submissionsSlice';

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

    return (
        <>
            <Autocomplete
                label="Tags"
                description="Use commas to separate tags"
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
