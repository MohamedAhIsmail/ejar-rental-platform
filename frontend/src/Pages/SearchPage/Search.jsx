import React from 'react';
import ProductList from '../../components/ProductLIst';
import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import NoSearchResults from '../../components/NoSearchResults';
import { MoonLoader } from 'react-spinners';

const useQuery = () => new URLSearchParams(useLocation().search);

export default function Search() {
  const query = useQuery();
  const searchTerm = query.get('query'); // القيمة اللي جت من النـاف بار
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Search Results | EJAR';
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/product`);
        const data = await res.json();
        console.log(data);

        const searcheddata = data.data.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(searcheddata);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  return (
    <>
      <div className="container">
        <div className="row mx-5">
          {/* <Sidebar/> */}

          <div className="search-results">
            {isLoading ? (
              <div className="text-center w-100 py-4">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70vh',
                    width: '100%',
                  }}
                >
                  <MoonLoader color="#b72a67" size={80} />
                  <p style={{ marginTop: 20, fontSize: '18px', color: '#555' }}>
                    Searching now , please wait...
                  </p>
                </div>
              </div>
            ) : results.length > 0 ? (
              results.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <NoSearchResults />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
