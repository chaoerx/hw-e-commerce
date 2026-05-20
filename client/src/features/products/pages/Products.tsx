import { Container, Text, Title } from '@mantine/core';

const Products = () => {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Our Products
      </Title>
      <Text size="lg">Products page - add your products here</Text>
    </Container>
  );
};

export default Products;
