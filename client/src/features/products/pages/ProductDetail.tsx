import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Spinner } from "../../../components/ui/Spinner";
import { useAuth } from "../../auth/context/AuthContext";
import { useAddCartItem } from "../../cart/hooks/useCartQueries";
import { useProduct } from "../hooks/useProductQueries";
import { getDiscountedPrice, hasDiscount } from "../utils/productPrice";

const formatCategory = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const ProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const productId = Number(id);
  const { isAuthenticated } = useAuth();
  const { data: product, isLoading, isError } = useProduct(productId);
  const addCartItem = useAddCartItem();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Spinner />
      </Container>
    );
  }

  if (isError || !product || !Number.isFinite(productId)) {
    return (
      <Container size="lg" py="xl">
        <ErrorMessage message="Product not found" />
        <Button mt="md" component={Link} to="/products">
          Back to Products
        </Button>
      </Container>
    );
  }

  const onSale = hasDiscount(product);
  const discountedPrice = getDiscountedPrice(product);
  const galleryImages = [
    product.thumbnail,
    ...(product.images?.filter((img) => img !== product.thumbnail) ?? []),
  ];
  const activeImage = selectedImage ?? product.thumbnail;
  const outOfStock = product.stock <= 0;
  const maxQuantity = Math.max(product.stock, 1);

  const handleAddToCart = () => {
    setCartMessage(null);

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location }, replace: false });
      return;
    }

    if (outOfStock) {
      return;
    }

    addCartItem.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          setCartMessage({
            type: "success",
            text: `Added ${quantity} item(s) to your cart.`,
          });
        },
        onError: (error) => {
          setCartMessage({
            type: "error",
            text: axios.isAxiosError(error)
              ? (error.response?.data as { message?: string })?.message ??
                "Failed to add item to cart."
              : "Failed to add item to cart.",
          });
        },
      },
    );
  };

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <Image
              src={activeImage}
              alt={product.title}
              height={400}
              radius="md"
              fit="contain"
              style={{ backgroundColor: "#f8f9fa" }}
            />
            {galleryImages.length > 1 && (
              <Group gap="xs" wrap="nowrap" style={{ overflowX: "auto" }}>
                {galleryImages.map((src) => (
                  <Box
                    key={src}
                    onClick={() => setSelectedImage(src)}
                    style={{
                      cursor: "pointer",
                      border:
                        activeImage === src
                          ? "2px solid #228be6"
                          : "2px solid transparent",
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  >
                    <Image src={src} alt="" width={72} height={72} radius="sm" />
                  </Box>
                ))}
              </Group>
            )}
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            {product.brand && (
              <Text size="sm" c="dimmed" tt="uppercase" fw={600}>
                {product.brand}
              </Text>
            )}

            <Title order={1}>{product.title}</Title>

            <Group gap="xs">
              <IconStarFilled size={18} color="#ffd43b" />
              <Text fw={600}>{product.rating.toFixed(1)}</Text>
              <Text size="sm" c="dimmed">
                • {product.stock} in stock
              </Text>
            </Group>

            <Group>
              {onSale ? (
                <>
                  <Text size="xl" fw={700} c="blue">
                    ${discountedPrice.toFixed(2)}
                  </Text>
                  <Text size="md" c="dimmed" td="line-through">
                    ${product.price.toFixed(2)}
                  </Text>
                  <Badge color="red" variant="filled">
                    -{Math.round(product.discountPercentage)}%
                  </Badge>
                </>
              ) : (
                <Text size="xl" fw={700} c="blue">
                  ${product.price.toFixed(2)}
                </Text>
              )}
              <Badge
                component={Link}
                to={`/products?category=${product.category}`}
                size="lg"
                color="blue"
                variant="light"
                style={{ cursor: "pointer" }}
              >
                {formatCategory(product.category)}
              </Badge>
            </Group>

            <Divider />

            <Text size="lg" style={{ lineHeight: 1.6 }}>
              {product.description}
            </Text>

            <Divider />

            {cartMessage && (
              <Alert
                color={cartMessage.type === "success" ? "green" : "red"}
                title={
                  cartMessage.type === "success" ? "Added to cart" : "Error"
                }
                withCloseButton
                onClose={() => setCartMessage(null)}
              >
                {cartMessage.text}
              </Alert>
            )}

            {!isAuthenticated && (
              <Alert color="blue" variant="light" title="Sign in required">
                You need to{" "}
                <Text
                  component={Link}
                  to="/login"
                  state={{ from: location }}
                  span
                  fw={600}
                >
                  log in
                </Text>{" "}
                to add items to your cart.
              </Alert>
            )}

            {outOfStock && (
              <Alert color="orange" title="Out of stock">
                This product is currently unavailable.
              </Alert>
            )}

            <Group align="flex-end" wrap="wrap">
              <NumberInput
                label="Quantity"
                value={quantity}
                onChange={(value) =>
                  setQuantity(
                    typeof value === "number"
                      ? Math.min(Math.max(1, value), maxQuantity)
                      : 1,
                  )
                }
                min={1}
                max={maxQuantity}
                disabled={outOfStock}
                w={120}
              />

              <Button
                size="lg"
                loading={addCartItem.isPending}
                disabled={outOfStock}
                onClick={handleAddToCart}
              >
                {isAuthenticated ? "Add to Cart" : "Log in to Add to Cart"}
              </Button>

              {cartMessage?.type === "success" && (
                <Button
                  size="lg"
                  variant="outline"
                  component={Link}
                  to="/cart"
                >
                  View Cart
                </Button>
              )}

              <Button
                size="lg"
                variant="default"
                component={Link}
                to="/products"
              >
                Back to Products
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
