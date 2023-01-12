import { Badge, Center, Container, Divider, Group } from "@mantine/core";
import SoundRecordingTag from "models/SoundRecordingTag.model";

interface TagListProps {
    tags: SoundRecordingTag[];
}

export default function TagList({ tags }: TagListProps) {
    return (
        <Container px={0} w="100%">
            <Center>
                <Divider
                    w="80%"
                    size="xs"
                    my="sm"
                    variant="solid"
                    label="Tags"
                    color="pink"
                    labelPosition="center"
                    labelProps={{
                        fw: 500,
                        size: 'sm',
                    }}
                />
            </Center>
            <Group spacing="xs" position="center">
                {tags.map(tag => (
                        <Badge key={tag.name} >{ tag.name }</Badge>
                    )
                )}
            </Group>
        </Container>  
    );
}