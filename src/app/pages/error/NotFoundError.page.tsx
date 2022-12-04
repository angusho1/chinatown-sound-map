import { Button, Container, createStyles, Group, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export default function NotFoundErrorPage() {
    const { classes } = useStyles();

    return (
        <Container className={classes.root}>
            <div className={classes.label}>404</div>
            <Title className={classes.title}>The page you are looking for was not found.</Title>
            <Text color="dimmed" size="lg" align="center" className={classes.description}>
                You may have mistyped the address, or the page has been moved to another URL.
            </Text>
            <Group position="center">
                <Link to="/">
                    <Button variant="subtle" size="md">
                        Go back to the home page
                    </Button>
                </Link>
            </Group>
        </Container>
    );
}

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80,
    },
    label: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 220,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
    
        [theme.fn.smallerThan('sm')]: {
            fontSize: 120,
        },
    },
  
    title: {
        fontFamily: theme.fontFamily,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 38,
    
        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },
    description: {
        maxWidth: 500,
        margin: 'auto',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl * 1.5,
    },
}));