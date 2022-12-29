import { FileInput, FileInputProps, Group,  Stack, Text, Avatar, CloseButton } from '@mantine/core';
import { useState } from 'react';
import ImageCarouselModal, { ImageModalState } from '../image-carousel/ImageCarouselModal';
import './ImageUploadInput.css';

interface ImageUploadInputProps {
    inputProps: any;
    removeImage(index: number): void;
}

export default function ImageUploadInput({ inputProps, removeImage }: ImageUploadInputProps) {
    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        opened: false,
        selectedIndex: 0,
    });
    const images = inputProps.value;

    const ValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
        if (Array.isArray(value) && value.length > 1) {
            return (<>{value.length} images selected</>);
        }
      
        return (<>1 image selected</>);
    };

    const imgSrc = (file: File) => URL.createObjectURL(file);

    return (
        <>
            <FileInput 
                label="Upload Images" 
                placeholder="Click to Upload Image(s)" 
                accept="image/png,image/jpeg"
                multiple 
                valueComponent={ValueComponent} 
                {...inputProps}
            />

            {images.length > 0 && (
                <div className="selected-image-list">
                    <Text size="sm" mt="sm" mb="sm">
                        Picked files:
                    </Text>
                    <Stack spacing={'sm'}>
                        {images.map((file: File, index: number) => (
                            <Group position="left" key={index}>
                                <Avatar
                                    sx={{ cursor: 'pointer' }}
                                    size={'sm'}
                                    radius={'xs'}
                                    src={imgSrc(file)}
                                    onClick={() => {
                                        setImageModalState({
                                            opened: true,
                                            selectedIndex: index,
                                        });
                                    }}
                                />
                                <Text size="sm">{file.name}</Text>
                                <CloseButton aria-label="Remove image" onClick={() => removeImage(index)} />
                            </Group>
                        ))}
                    </Stack>
                </div>
            )}

            <ImageCarouselModal
                opened={imageModalState.opened}
                selectedIndex={imageModalState.selectedIndex}
                images={images}
                onClose={() => setImageModalState({
                    ...imageModalState,
                    opened: false,
                })}
                showFileNames
            />
        </>
    )
}
