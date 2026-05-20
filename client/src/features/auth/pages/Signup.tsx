import { Card, Container, Title } from "@mantine/core";

const Signup = () => {
  return (
    <Container size="xs" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Signup
        </Title>
      </Card>
    </Container>
  );
};

export default Signup;
