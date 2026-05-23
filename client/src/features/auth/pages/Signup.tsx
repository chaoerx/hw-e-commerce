import {
  Alert,
  Anchor,
  Button,
  Card,
  Container,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <Container size="xs" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Sign Up
        </Title>

        <Stack gap="md">
          <Alert
            icon={<IconInfoCircle size={18} />}
            title="Registration not available"
            color="blue"
            variant="light"
          >
            This demo store uses DummyJSON for authentication. New account
            registration is not supported — please sign in with an existing test
            account instead.
          </Alert>

          <Text size="sm" c="dimmed">
            Available test credentials:
          </Text>

          <List size="sm" spacing="xs" withPadding>
            <List.Item>
              <Text span fw={500}>
                emilys
              </Text>{" "}
              / emilyspass
            </List.Item>
            <List.Item>
              <Text span fw={500}>
                michaelw
              </Text>{" "}
              / michaelwpass
            </List.Item>
          </List>

          <Button component={Link} to="/login" fullWidth>
            Go to Login
          </Button>

          <Text size="sm" ta="center" c="dimmed">
            Already have an account?{" "}
            <Anchor component={Link} to="/login" fw={500}>
              Sign in
            </Anchor>
          </Text>
        </Stack>
      </Card>
    </Container>
  );
};

export default Signup;
