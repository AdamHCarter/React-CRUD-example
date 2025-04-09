import React from "react";
import { useSWRConfig } from 'swr';
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

export const ProductAdd = () => {
  
  const productPostAPI =
    "https://products-cloud-example-main-9w79vp.laravel.cloud/api/products/";

  const { mutate } = useSWRConfig();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    
    if (values.name.length < 3) {
      errors.name = "Name length must be at least 3 characters.";
    }
    
    if (values.price === "" || isNaN(values.price)) {
      errors.price = "Price must be a number.";
    }

    if (values.description.length < 3) {
      errors.description = "Description length must be at least 3 characters.";
    }

    if (values.item_number === "" || isNaN(values.item_number)) {
      errors.item_number = "Item Number must be a number.";
    }

    if (values.image.length < 3) {
      errors.image = "Image length must be at least 3 characters.";
    }

    if (!values.image.toLowerCase().startsWith("http")) {
      errors.image = "Image must be a URL."
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
      handleUpdateClick({ ...values });
      formik.resetForm();      
    },
  });

  const addProduct = async (product) => {
    return axios.post(productPostAPI, product).then((res) => res.data);
  }

  const handleUpdateClick = async (values) => {
    const product = { name: values.name, price: values.price, description: values.description, item_number: values.item_number, image: values.image};
    const newProduct = await addProduct(product);
    const id = newProduct.product.id;
    mutate([productPostAPI, id], newProduct);
    navigate(`/show/${id}`);
  }  

  return (
    <div className="container-fluid">
      <div>
        <h1>Add Product Form</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div>
            <p>
              <input type="text" placeholder="Name.." name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.name && formik.errors.name && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.name}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <input type="text" placeholder="Price.." name="price" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.price && formik.errors.price && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.price}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <input type="text" placeholder="Description.." name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.description && formik.errors.description && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.description}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <input type="text" placeholder="Item Number..." name="item_number" value={formik.values.item_number} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
            </p>
            {formik.touched.item_number && formik.errors.item_number && (
              <div style={{ color: "red" }}>
                <p>{formik.errors.item_number}</p>
              </div>
            )}
          </div>
          <div>
            <p>
              <input type="text" placeholder="Image URL" name="image" value={formik.values.image} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ paddding: "0"}} />
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
                Add Product
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}