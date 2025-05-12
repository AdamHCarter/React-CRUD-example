import React from "react";
import useSWR from "swr";
import useSWRMutation from 'swr/mutation';
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const ProductCard = (props) => {
  const id = props.id || 10;
  const productGetAPI =
    "https://testproductsapi.ctrlaltcarter.com/api/products/";

  const fetchWithId = (url, id) => axios.get(url + id).then((res) => res.data);
  const deleteWithId = (url, id) => axios.delete(url + id).then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    [productGetAPI, id],
    ([productGetAPI, id]) => fetchWithId(productGetAPI, id)
  );

  const { trigger } = useSWRMutation([productGetAPI, id],([productGetAPI, id]) => deleteWithId(productGetAPI, id));

  const navigate = useNavigate();

  if (error) return <div>Failed to load, Error: {error}</div>;
  if (isLoading) return <div>loading...</div>;

  const handleDeleteClick = async (id) => {
    await trigger([productGetAPI, id], {
      optimisticData: (currentData) => {
        return {};
      },
      revalidate: false,
    });
    navigate(`/`);
  };

  const url = "/show/" + id;
  const urlEdit = "/edit/" + id;  

  return (    
    <div className="container">
      { data.product ? 
        <div className="card mt-1 mb-3" style={{ maxWidth: "300px" }}>
          <h5 className="card-header "><Link to={url}>Detail</Link> | <Link to={urlEdit}>Edit</Link> | <button onClick={() => handleDeleteClick(data.product.id)}>Delete</button></h5>
          <Link to={url}>
            <img
              src={data.product.image}
              className="card-img-top img-fluid p-0 img-thumbnail"
              alt="Product close-up"
            />
          </Link>

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
      : ""}
    </div>
  )
}