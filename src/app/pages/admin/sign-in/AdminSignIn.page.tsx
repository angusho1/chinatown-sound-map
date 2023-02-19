import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Button, Container, createStyles, Group, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { loginRequest } from "AuthConfig";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignInPage() {
    const { instance } = useMsal();
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const { classes } = useStyles();
    const { height } = useViewportSize();
    
    useEffect(() => {
        if (isAuthenticated) navigate('/admin/submissions');
    }, [navigate, isAuthenticated]);

    const signIn = async () => {
        try {
            await instance.loginRedirect(loginRequest);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Container sx={{ minHeight: height-120 }}>
            <Container className={classes.inner}>
                <Title className={classes.title}>Admin Sign-in</Title>
                <Group position="center">
                    <Button
                        variant="outline"
                        size="lg"
                        radius="lg"
                        onClick={signIn}
                    >
                        Sign In
                    </Button>
                </Group>
            </Container>
        </Container>
    );
}

const useStyles = createStyles((theme) => ({
    inner: {
        margin: 'auto',
        paddingTop: 150,
        paddingBottom: 80,
    },
    title: {
        fontFamily: theme.fontFamily,
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 38,
        marginBottom: theme.spacing.xl * 1.5,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },
}));