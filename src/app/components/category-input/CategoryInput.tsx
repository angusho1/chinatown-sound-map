import { useState } from 'react';
import { ActionIcon, Autocomplete, AutocompleteItem, Chip, Space, Flex } from '@mantine/core';
import SoundRecordingCategory from 'models/SoundRecordingCategory.model';
import { IconPlus, IconX } from '@tabler/icons';
import './CategoryInput.css';

interface CategoryInputProps {
    inputProps: any;
    autoCompleteProps: any;
    addCategory(category: SoundRecordingCategory): void;
    removeCategory(index: number): void;
}

export default function CategoryInput({ inputProps, autoCompleteProps, addCategory, removeCategory }: CategoryInputProps) {
    const [textInput, setTextInput] = useState('');

    const categories: SoundRecordingCategory[] = inputProps.value;
    const existingCategories: SoundRecordingCategory[] = [
        { id: '', name: 'Chinatown' },
        { id: '', name: 'Test' },
    ];

    const autoCompleteItems: AutocompleteItem[] = existingCategories.map(category => {
        return {
            value: category.name,
            id: category.id,
            name: category.name,
        }
    });

    const onAddCategory = () => {
        if (autoCompleteProps.error || !/\S/.test(autoCompleteProps.value)) return;
        setTextInput('');
        addCategory({ id: '', name: autoCompleteProps.value });
    }

    const onDropdownItemSelect = (item: AutocompleteItem) => {
        setTextInput('');
        addCategory({ id: item.id, name: item.name });
    };

    return (
        <>
            <Autocomplete
                label="Categories"
                description="Use commas to separate categories"
                placeholder="Add Categories"
                data={autoCompleteItems}
                onItemSubmit={onDropdownItemSelect}
                value={textInput}
                onChange={setTextInput}
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
