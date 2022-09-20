import { FileInput, FileInputProps, Group,  Stack, Text, Avatar, CloseButton } from '@mantine/core';
import './ImageUploadInput.css';

interface ImageUploadInputProps {
    inputProps: any;
    removeImage(index: number): void;
}

export default function ImageUploadInput({ inputProps, removeImage }: ImageUploadInputProps) {
    const images = inputProps.value;

    const ValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
        if (Array.isArray(value) && value.length > 1) {
            return (<>{value.length} images selected</>);
        }
      
        return (<>1 image selected</>);
    };

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
                                <Avatar size={'sm'} radius={'xs'} src={URL.createObjectURL(file)}/>
                                <Text size="sm">{file.name}</Text>
                                <CloseButton aria-label="Remove image" onClick={() => removeImage(index)} />
                            </Group>
                        ))}
                    </Stack>
                </div>
            )}

        </>
    )
}