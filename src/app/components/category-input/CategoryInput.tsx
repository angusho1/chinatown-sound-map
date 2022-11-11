import { ActionIcon, Autocomplete, AutocompleteItem, Chip, Space, Flex } from '@mantine/core';
import SoundRecordingCategory from 'models/SoundRecordingCategory.model';
import { IconPlus, IconX } from '@tabler/icons';
import './CategoryInput.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchCategories, selectCategories, selectGetCategoriesStatus } from 'features/submissions/submissionsSlice';

interface CategoryInputProps {
    inputProps: any;
    autoCompleteProps: any;
    addCategory(category: SoundRecordingCategory): void;
    removeCategory(index: number): void;
    setAutoCompleteField(value: string): void;
}

export default function CategoryInput({ inputProps, autoCompleteProps, addCategory, removeCategory, setAutoCompleteField }: CategoryInputProps) {
    const dispatch = useAppDispatch();
    const categoriesStatus = useAppSelector(selectGetCategoriesStatus);
    const existingCategories = useAppSelector(selectCategories);

    if (categoriesStatus === 'idle') dispatch(fetchCategories());

    const categories: SoundRecordingCategory[] = inputProps.value;
    const autoCompleteItems: AutocompleteItem[] = existingCategories.map(category => {
        return {
            value: category.name,
            id: category.id,
            name: category.name,
        }
    });

    const onAddCategory = () => {
        if (autoCompleteProps.error || !/\S/.test(autoCompleteProps.value)) return;
        setAutoCompleteField('');
        addCategory({ id: '', name: autoCompleteProps.value });
    }

    const onDropdownItemSelect = (item: AutocompleteItem) => {
        setAutoCompleteField('');
        addCategory({ id: item.id, name: item.name });
    };

    const onFormKeyEvent = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            onAddCategory();
        }
    }

    return (
        <>
            <Autocomplete
                label="Categories"
                description="Use commas to separate categories"
                placeholder="Add Categories"
                data={autoCompleteItems}
                onItemSubmit={onDropdownItemSelect}
                onKeyDown={onFormKeyEvent}
                rightSection={(
                    <ActionIcon variant="subtle" onClick={onAddCategory}>
                        <IconPlus size={16} />
                    </ActionIcon>
                )}
                {...autoCompleteProps}
            />

            <Space h="sm" />

            {categories.length > 0 && (
                <Chip.Group position="left">
                    {
                        categories.map((category: SoundRecordingCategory, index: number) =>
                            <Chip
                                key={index}
                                value={category.name}
                                variant="filled"
                            >
                                <Flex>
                                    <ActionIcon variant="transparent" onClick={() => removeCategory(index)}>
                                        <IconX size={12} />
                                    </ActionIcon>
                                    {category.name}
                                </Flex>
                            </Chip>
                        )
                    }
                </Chip.Group>
            )}
        </>
    )
}
