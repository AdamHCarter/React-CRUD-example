import React from "react";
import useSWR, { useSWRConfig } from 'swr';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useFormik } from "formik";

export const ProductEdit = () => {
  const { id } = useParams();
  
  const productGetAPI =
    "https://testproductsapi.ctrlaltcarter.com/api/products/";

  const fetchWithId = (url, id) => axios.get(url + id).then((res) => res.data);

  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR(
    [productGetAPI, id],
    ([productGetAPI, id]) => fetchWithId(productGetAPI, id)
  );

  const validate = (values) => {
    const errors = {};
    
    if (values.name.length > 0 && values.name.length < 3) {
      errors.name = "Name length must be at least 3 characters.";
    }
    
    if (values.price !== "" && isNaN(values.price)) {
      errors.price = "Price must be a number.";
    }

    if (values.description.length > 0 && values.description.length < 3) {
      errors.description = "Description length must be at least 3 characters.";
    }

    if (values.item_number !== "" && isNaN(values.item_number)) {
      errors.item_number = "Item Number must be a number.";
    }

    if (values.image.length > 0 && values.image.length < 3) {
      errors.name = "Name length must be at least 3 characters.";
    }

    return errors;
  };


  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      item_number: "",
      image: "",
    },
    validate,
    onSubmit: (values) => {
      if (values.name === "") {
        values.name = data.product.name;
      }
      if (values.price === "") {
        values.price = data.product.price;
      }
      if (values.description === "") {
        values.description = data.product.description;
      }
      if (values.item_number === "") {
        values.item_number = data.product.item_number;
      }
      if (values.image === "") {
        values.image = data.product.image;
      }
      handleUpdateClick({ ...values });
      formik.resetForm();
    },
  });

  if (error) return <div>Failed to load, Error: {error}</div>;
  if (isLoading) return <div>loading...</div>;

  const updateProduct = async (product) => {
    return axios.put(productGetAPI, product).then((res) => res.data);
  }

  const handleUpdateClick = async (values) => {
    const product = { ...data.product, name: values.name, price: values.price, description: values.description, item_number: values.item_number, image: values.image};
    const newData = { ...data, product: product};

    const options = {
      optimisticData: newData,
      rollBackOnError(error) {
        // If it's timeout abort error, don't rollback
        return error.name !== 'AbortError';
      },
    }

    mutate([productGetAPI, id], updateProduct(product), options);
  }  

  return (
    <div className="container-fluid">
      <div>
        <h1>Update Product Form</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div>
            <p>
              <input type="text" placeholder={data.product.name} name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.name && formik.errors.name && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.name}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <input type="text" placeholder={data.product.price} name="price" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.price && formik.errors.price && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.price}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <input type="text" placeholder={data.product.description} name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.description && formik.errors.description && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.description}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <input type="text" placeholder={data.product.item_number} name="item_number" value={formik.values.item_number} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.item_number && formik.errors.item_number && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.item_number}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <input type="text" placeholder={data.product.image} name="image" value={formik.values.image} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.image && formik.errors.image && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.image}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <button type="submit" className="btn btn-primary">
                Update Product
              </button>
            </p>
          </div>
        </div>
      </form>
      <hr />
      <div className="container">
        <div className="card mt-1 mb-3" style={{ maxWidth: "600px" }}>
          <h5 className="card-header ">Preview</h5>
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
  )
}