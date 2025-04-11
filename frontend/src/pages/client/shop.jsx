import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ProductCard from '@/components/product_card';
import SkeletonProductCard from '@/components/shop/skeltonProductCard';
import { sortOptions } from '@/config';
import Pagination from '@/components/shop/pagination';
import FilterSection from '@/components/shop/filterSection';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchAllFilteredProducts, fetchAllBrands } from '@/lib/store/features/product/productSlice';

const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
    }
  }
  return queryParams.join("&");
};

function ShoppingPage() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.product);
  const [filters, setFilters] = useState({});
  const [brands, setBrands] = useState([]);
  const [sort, setSort] = useState('relevant');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 12;

  const categorySearchParams = searchParams.get('category');

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOption] };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  useEffect(() => {
    dispatch(fetchAllBrands())
      .then((action) => {
        if (action.payload?.data) {
          setBrands(action.payload.data);
        }
      });
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const queryString = createSearchParamsHelper(filters);
      if (queryString) {
        setSearchParams(prevParams => {
          const newParams = new URLSearchParams(prevParams);
          queryString.split("&").forEach(param => {
            const [key, value] = param.split("=");
            newParams.set(key, decodeURIComponent(value));
          });
          return newParams;
        });
      }
    } else {
      setSearchParams({});
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    setSort('relevant');
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
  }, [categorySearchParams]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }))
      .finally(() => {
        setLoading(false);
      });
    setCurrentPage(1);
  }, [dispatch, filters, sort]);

  const activeProducts = productList?.filter(product => product.isActive) || [];
  const totalPages = Math.ceil((activeProducts?.length || 0) / itemsPerPage);
  const currentItems = activeProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vh] lg:px-[9vh]'>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <FilterSection
            brands={brands}
            filters={filters}
            handleFilter={handleFilter}
          />

          <div className="flex-1">
            <div className="flex justify-end mb-6">
              <select
                onChange={handleSort}
                value={sort}
                className="border-2 border-gray-300 text-sm px-4 py-2 rounded-xl"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {
                loading ? (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <SkeletonProductCard key={index} />
                  ))
                ) : (
                  currentItems && currentItems.length > 0 ? 
                    currentItems.map((product) => (
                      <ProductCard
                        key={product._id}
                        item={product}
                      />
                    )) : (
                      <p className="col-span-full text-center text-gray-500">
                        No products found
                      </p>
                    )
                )
              }
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />

    </div>
  );
}

export default ShoppingPage;