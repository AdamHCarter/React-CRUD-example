import React from "react";
import useSWR from "swr";
import axios from "axios";
import { useSearchParams } from 'react-router-dom';
import { useFormik } from "formik";

import ProductCard from "../../components/ProductCard";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || "";
  const sortBy = searchParams.get('sortBy') || "id";
  const direction = searchParams.get('direction') || "asc";
  const productsGetAPI = `https://products-cloud-example-main-9w79vp.laravel.cloud/api/products/?sortBy=${sortBy}&direction=${direction}`;
  const productsSearchAPI = `https://products-cloud-example-main-9w79vp.laravel.cloud/api/search/?q=${q}&sortBy=${sortBy}&direction=${direction}`;
  const productsFetchAPI = q !== "" ? productsSearchAPI : productsGetAPI;

  const fetcher = (url) => axios.get(url).then((res) => res.data);

  const formik = useFormik({
      initialValues: {
        q: q,
        sortBy: sortBy,
        direction: direction,
      },
      onSubmit: (values) => {
        setSearchParams((prev) => {
          prev.set("q", values.q);
          prev.set("sortBy", values.sortBy);
          prev.set("direction", values.direction);
          return prev;
        });
        formik.resetForm();
    },
  });

  const { data, error, isLoading, mutate } = useSWR(
    [productsFetchAPI, q, sortBy, direction],
    ([productsFetchAPI, q, sortBy, direction]) =>
      fetcher(productsFetchAPI, q, sortBy, direction)
  );

  mutate();

  if (error) return <div>Failed to load, Error: {error}</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="container-fluid">
      <div>
        <h1>Admin Products</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div className="ms-2">
            <p>
              <input type="text" placeholder="Enter Search.." name="q" value={formik.values.q} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
              <label htmlFor="sortBy" className="ms-3">Sort By: </label>
              <select id="sortBy" name="sortBy" selected={formik.values.sortBy} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="id">id</option>
                <option value="name">name</option>
                <option value="price">price</option>
                <option value="item_number">item_number</option>
              </select>
              <label htmlFor="direction" className="ms-3">Direction: </label>
              <select id="direction" name="direction" selected={formik.values.direction} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="asc">asc</option>
                <option value="desc">desc</option>
              </select>
              <button type="submit" className="btn btn-primary ms-3">
                Search
              </button>
            </p>
          </div>
        </div>
      </form>
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
          {data.products.length > 0
            ? data.products.map((product, index) => {
                return <ProductCard key={index} id={product.id} />;
              })
            : "No products to show."}
        </div>
      </div>
    </div>
  )
}