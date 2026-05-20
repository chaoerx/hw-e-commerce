import {
  Badge,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image
            src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
            alt="Product"
            height={400}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={1} mb="md">
            Product Title
          </Title>
          <Group mb="md">
            <Badge size="lg" color="pink">
              $99.99
            </Badge>
            <Badge size="lg" color="blue">
              Category
            </Badge>
          </Group>
          <Text size="lg" mb="md">
            Product description goes here
          </Text>
          <Text size="md" mb="xl" c="dimmed">
            Stock: 10 units available
          </Text>
          <Group>
            <Button size="lg">Add to Cart</Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Back to Products
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
