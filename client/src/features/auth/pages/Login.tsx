import { Card, Container, Title } from "@mantine/core";

const Login = () => {
  return (
    <Container size="xs" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Login
        </Title>
      </Card>
    </Container>
  );
};

export default Login;
