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
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Spinner } from "../../../components/ui/Spinner";
import { useAuth } from "../../auth/context/AuthContext";
import { useAddCartItem } from "../../cart/hooks/useCartQueries";
import { getDiscountedPrice, hasDiscount } from "../utils/productPrice";
import { useProduct } from "../hooks/useProductQueries";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);
  const { isAuthenticated } = useAuth();
  const { data: product, isLoading, isError } = useProduct(productId);
  const addCartItem = useAddCartItem();

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Spinner />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container size="lg" py="xl">
        <ErrorMessage message="Product not found" />
        <Button mt="md" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const onSale = hasDiscount(product);
  const discountedPrice = getDiscountedPrice(product);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    addCartItem.mutate(
      { productId: product.id },
      { onSuccess: () => navigate("/cart") },
    );
  };

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image src={product.thumbnail} alt={product.title} height={400} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={1} mb="md">
            {product.title}
          </Title>
          <Group mb="md">
            {onSale ? (
              <>
                <Badge size="lg" color="pink">
                  ${discountedPrice.toFixed(2)}
                </Badge>
                <Text size="sm" c="dimmed" td="line-through">
                  ${product.price.toFixed(2)}
                </Text>
                <Badge color="red" variant="filled">
                  -{Math.round(product.discountPercentage)}%
                </Badge>
              </>
            ) : (
              <Badge size="lg" color="pink">
                ${product.price.toFixed(2)}
              </Badge>
            )}
            <Badge size="lg" color="blue">
              {product.category}
            </Badge>
          </Group>
          <Text size="lg" mb="md">
            {product.description}
          </Text>
          <Text size="md" mb="xl" c="dimmed">
            Stock: {product.stock} units available • Rating:{" "}
            {product.rating.toFixed(1)}
          </Text>
          <Group>
            <Button
              size="lg"
              loading={addCartItem.isPending}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
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
