import "./App.css";
//import { useState } from "react";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const fetchWithId = (url, id) => axios.get(url + id).then((res) => res.data);

function App() {
  return (
    <div>
      <ProductShow id={10} />
      <ProductsIndex q="" sortBy="name" direction="desc" />
    </div>
  );
}

function ProductsIndex(props) {
  const q = props.q ? props.q : "";
  const sortBy = props.sortBy ? props.sortBy : "";
  const direction = props.direction ? props.direction : "";
  const productsGetAPI = `https://products-cloud-example-main-9w79vp.laravel.cloud/api/products/?sortBy=${sortBy}&direction=${direction}`;
  const productsSearchAPI = `https://products-cloud-example-main-9w79vp.laravel.cloud/api/search/?q=${q}&sortBy=${sortBy}&direction=${direction}`;
  const productsFetchAPI = q !== "" ? productsSearchAPI : productsGetAPI;
  const { data, error, isLoading } = useSWR(
    [productsFetchAPI, q, sortBy, direction],
    ([productsFetchAPI, q, sortBy, direction]) =>
      fetcher(productsFetchAPI, q, sortBy, direction)
  );

  if (error) return <div>Failed to load, Error: {error}</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="container-fluid">
      <div>
        <h1>Admin Products</h1>
      </div>
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
  );
}

function ProductShow(props) {
  const id = props.id;
  const productGetAPI =
    "https://products-cloud-example-main-9w79vp.laravel.cloud/api/products/";
  const { data, error, isLoading } = useSWR(
    [productGetAPI, id],
    ([productGetAPI, id]) => fetchWithId(productGetAPI, id)
  );

  if (error) return <div>Failed to load, Error: {error}</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="container-fluid">
      <div>
        <h1>{data.product.name}</h1>
      </div>
      <div className="container">
        <div className="card mt-1 mb-3" style={{ maxWidth: "300px" }}>
          <h5 className="card-header ">Detail</h5>
          <img
            src={data.product.image}
            className="card-img-top img-fluid p-0 img-thumbnail"
            alt="Product close-up"
          />

          <div className="card-body">
            <h3 className="card-title">{data.product.name}</h3>
            <h4 className="card-text">{data.product.price}</h4>
            <p className="card-text">{data.product.description}</p>
            <p>
              <small className="text-muted">
                Product #: {data.product.item_number}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard(props) {
  const id = props.id;
  const productGetAPI =
    "https://products-cloud-example-main-9w79vp.laravel.cloud/api/products/";
  const { data, error, isLoading } = useSWR(
    [productGetAPI, id],
    ([productGetAPI, id]) => fetchWithId(productGetAPI, id)
  );

  if (error) return <div>Failed to load, Error: {error}</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="container">
      <div className="card mt-1 mb-3" style={{ maxWidth: "300px" }}>
        <h5 className="card-header ">Detail</h5>
        <img
          src={data.product.image}
          className="card-img-top img-fluid p-0 img-thumbnail"
          alt="Product close-up"
        />

        <div className="card-body">
          <h3 className="card-title">{data.product.name}</h3>
          <h4 className="card-text">{data.product.price}</h4>
          <p className="card-text">{data.product.description}</p>
          <p>
            <small className="text-muted">
              Product #: {data.product.item_number}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
