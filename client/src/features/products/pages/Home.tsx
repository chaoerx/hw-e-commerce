import { Container } from "@mantine/core";
import { CategoryCards } from "../../../components/home/CategoryCards";
import { FeaturedProducts } from "../../../components/home/FeaturedProducts";
import { HeroSection } from "../../../components/home/HeroSection";
import HomeInfoSection from "../../../components/home/HomeInfoSection";
import { useCategories } from "../hooks/useProductQueries";

const Home = () => {
  const { data: categories } = useCategories();

  return (
    <Container size="xl" py="xl">
      <HeroSection />
      <CategoryCards categories={categories} />
      <FeaturedProducts />
      <HomeInfoSection />
    </Container>
  );
};

export default Home;
