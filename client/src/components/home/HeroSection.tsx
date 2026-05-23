import { Box, Button, Container, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <Box
      mb="xl"
      py={{ base: 48, md: 72 }}
      px="md"
      style={{
        borderRadius: 16,
        background:
          "linear-gradient(135deg, #228be6 0%, #7950f2 50%, #be4bdb 100%)",
        color: "white",
      }}
    >
      <Container size="md">
        <Stack align="center" gap="lg" ta="center">
          <Title order={1} size="h1" c="white">
            Shop Smarter, Live Better
          </Title>
          <Text size="lg" maw={520} c="white" opacity={0.95}>
            Explore curated deals across beauty, tech, fashion, and more — all
            in one place.
          </Text>
          <Button
            component={Link}
            to="/products"
            size="lg"
            variant="white"
            color="dark"
          >
            Shop All Products
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};
