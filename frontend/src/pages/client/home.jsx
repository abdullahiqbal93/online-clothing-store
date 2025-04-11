import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/home/heroSection';
import CategorySection from '@/components/home/categorySection';
import NewArrivalsSection from '@/components/home/newArrivalSection';
import HowItWorksSection from '@/components/home/howItWorksSection';
import TestimonialsSection from '@/components/home/testimonialSection';
import AboutUsSection from '@/components/home/aboutUsSection';
import FadeInSection from '@/components/fadeInSection';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "sonner";
import { fetchAllFilteredProducts } from '@/lib/store/features/product/productSlice';
import { assets } from '@/assets/assets';

const testimonialsData = [
  { name: "Sarah Chen", image: "https://randomuser.me/api/portraits/women/32.jpg", text: "Amazing selection of clothes! The quality is outstanding and delivery was super fast.", rating: 5 },
  { name: "James Wilson", image: "https://randomuser.me/api/portraits/men/33.jpg", text: "The size guide was spot-on, and customer service helped me choose the perfect fit.", rating: 4 },
  { name: "Olivia Martinez", image: "https://randomuser.me/api/portraits/women/34.jpg", text: "Love the trendy collections! Every purchase has been perfect, and returns are hassle-free.", rating: 5 },
  { name: "David Kim", image: "https://randomuser.me/api/portraits/men/35.jpg", text: "Great prices and frequent sales. The mobile view makes shopping so convenient!", rating: 4 }
];

const slides = [assets.bannerOne, assets.bannerTwo, assets.bannerThree];

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('men');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList } = useSelector(state => state.product);
  const { user } = useSelector(state => state.user);

  function handleNavigateToListingPage(getCurrentItem) {
    const currentFilter = { category: [getCurrentItem.name], brand: [] };
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    navigate('/shop/listing');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAllFilteredProducts({ 
          filterParams: {}, 
          sortParams: 'price-lowtohigh' 
        })).unwrap();
      } catch (error) {
        toast.error('Failed to fetch products');
      }
    };
    
    fetchData();
    sessionStorage.removeItem('filters');
  }, [dispatch]);

  const newArrivalProducts = productList
    .filter((product) => product.category === selectedCategory && product.isActive !== false)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
    sessionStorage.removeItem('filters'); 
  }, [dispatch]);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vh] lg:px-[9vh]'>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <HeroSection slides={slides} />
          <CategorySection handleNavigate={handleNavigateToListingPage} />

        <FadeInSection delay={100}>
          <NewArrivalsSection 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            newArrivalProducts={newArrivalProducts} 
          />
        </FadeInSection>
        <FadeInSection delay={150}>
          <HowItWorksSection />
        </FadeInSection>
        <FadeInSection delay={200}>
          <TestimonialsSection testimonialsData={testimonialsData} />
        </FadeInSection>
        <FadeInSection delay={250}>
          <AboutUsSection aboutImg={assets.aboutImg} />
        </FadeInSection>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;