import { useState } from 'react';
import { Autocomplete, AutocompleteItem, Chip, Space } from '@mantine/core';
import SoundRecordingCategory from 'models/SoundRecordingCategory.model';

interface CategoryInputProps {
    inputProps: any;
    addCategory(category: SoundRecordingCategory): void;
    removeCategory(index: number): void;
}

export default function CategoryInput({ inputProps, addCategory, removeCategory }: CategoryInputProps) {
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

    const onItemSubmit = (item: AutocompleteItem) => {
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
                onItemSubmit={onItemSubmit}
                value={textInput}
                onChange={setTextInput}
            />

            <Space h="sm" />

            {categories.length > 0 && (
                <Chip.Group position="left">
                    {
                        categories.map((category: SoundRecordingCategory, index: number) =>
                            <Chip
                                key={index}
                                value={category.name}
                                onClick={() => removeCategory(index)}
                            >
                                {category.name}
                            </Chip>
                        )
                    }
                </Chip.Group>
            )}
        </>
    )
}
