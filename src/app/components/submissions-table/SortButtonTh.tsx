
// Ref: https://ui.mantine.dev/component/table-sort

import { Center, createStyles, Group, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons";

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    isPrimarySort: boolean;
    sorted: boolean;
    onSort(): void;
    width?: number;
}

export default function SortButtonTh({ children, reversed, sorted, isPrimarySort, onSort, width }: ThProps) {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;

    return (
        <th className={classes.th} style={{ width: width ? `${width}px` : undefined }}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position="apart">
                    <Text weight={isPrimarySort ? 800 : 500} size="sm">
                        {children}
                    </Text>
                    <Center>
                        <Icon size={16} stroke={isPrimarySort ? 3 : 1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </th>
    );
};

const useStyles = createStyles((theme) => ({
    th: {
      padding: '0 !important',
    },
    control: {
      width: '100%',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    },
}));
  