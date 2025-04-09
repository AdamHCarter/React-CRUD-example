import "./App.css";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/home";
import ProductShow from "./pages/product-show";
import ProductEdit from "./pages/product-edit";
import ProductAdd from "./pages/product-add";


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/show/:id" element={<ProductShow />} />
        <Route path="/edit/:id" element={<ProductEdit />} />
        <Route path="/add" element={<ProductAdd />} />
      </Routes>
      <Footer />      
    </>
  );
}

export default App;
