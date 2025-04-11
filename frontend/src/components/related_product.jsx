import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/product_card';

function RelatedProducts({ products, category, brand, handleAddToCart }) {
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            let productsCopy = products.filter(p => p.isActive !== false);
            
            const currentProductId = productsCopy.find(p => p.category === category && p.brand === brand)?._id;
            productsCopy = productsCopy.filter(item => item._id !== currentProductId);
            
            let filteredProducts = productsCopy.filter(
                (item) => item.category === category && item.brand === brand
            );
            
            if (filteredProducts.length === 0) {
                filteredProducts = productsCopy.filter(
                    (item) => item.category === category
                );
            }

            if (filteredProducts.length === 0) {
                filteredProducts = productsCopy;
            }
            
            filteredProducts = filteredProducts.slice(0, 4);
            setRelated(filteredProducts);
        }
    }, [products, category, brand]);

    if (related.length === 0) {
        return null;
    }

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <h1 className="text-3xl text-center font-bold mt-12 mb-14">Related Products</h1>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4">
                {related.map((product, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-[250px] sm:w-[280px] md:w-[280px] lg:w-[320px]"
                    >
                        <ProductCard item={product} handleAddToCart={handleAddToCart} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts
