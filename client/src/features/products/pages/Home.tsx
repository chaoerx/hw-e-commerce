import {
  Badge,
  Box,
  Card,
  Container,
  Group,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";

import HomeInfoSection from "../../../components/home/HomeInfoSection";

const Home = () => {
  return (
    <Container size="xl" py="xl">
      <Box mb="xl" ta="center">
        <Title order={1} mb="md">
          Welcome to E-Commerce Store
        </Title>
        <Text size="lg" c="dimmed">
          Discover amazing products across all categories
        </Text>
      </Box>

      <Recommendations />

      <HomeInfoSection />
    </Container>
  );
};

const Recommendations = () => {
  return (
    <Box mb="xl">
      <Title order={2} mb="md">
        ✨ Recommended for You
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ cursor: "pointer", height: "100%" }}
        >
          <Card.Section>
            <Image
              src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
              height={160}
              alt="Essence Mascara Lash Princess"
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500} lineClamp={1}>
              Essence Mascara Lash Princess
            </Text>
          </Group>

          <Group justify="space-between">
            <Text size="xl" fw={700} c="blue">
              $9.99
            </Text>
            <Badge color="red" variant="filled">
              -10%
            </Badge>
          </Group>

          <Group gap={4} mt="xs">
            <Text size="sm" c="dimmed">
              ⭐ 2.56
            </Text>
            <Text size="sm" c="dimmed">
              • 99 in stock
            </Text>
          </Group>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Home;
