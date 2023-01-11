import { Badge, Center, Container, Divider, Group } from "@mantine/core";
import SoundRecordingCategory from "models/SoundRecordingCategory.model";

interface CategoryListProps {
    categories: SoundRecordingCategory[];
}

export default function CategoryList({ categories }: CategoryListProps) {
    return (
        <Container px={0} w="100%">
            <Center>
                <Divider
                    w="80%"
                    size="xs"
                    my="sm"
                    variant="solid"
                    label="Categories"
                    color="pink"
                    labelPosition="center"
                    labelProps={{
                        fw: 500,
                        size: 'sm',
                    }}
                />
            </Center>
            <Group spacing="xs" position="center">
                {categories.map(category => (
                        <Badge key={category.name} >{ category.name }</Badge>
                    )
                )}
            </Group>
        </Container>  
    );
}