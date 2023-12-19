import { useNavigate, Route,Routes } from 'react-router-dom';
import LoginComponent from './Components/Login';
import HomeComponent from './Components/Home';
import DashboardComponent from './Components/Dashboard';
import CategoriesComponent from './Components/Categories';
import CategoryAddComponent from './Components/Category-add';
import ProductAddComponent from './Components/Product-add';
import ProductsComponent from './Components/Products';
import SlideComponent from './Components/Slide';
import './App.css';

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginComponent/>}/>
        <Route path="/home" element={<HomeComponent/>}>
          <Route path="" element={<DashboardComponent/>}/>
          <Route path="categories" element={<CategoriesComponent/>}/>
          <Route path="slides" element={<SlideComponent/>}/>
          <Route path="category-add" element={<CategoryAddComponent/>}/>
          <Route path="products" element={<ProductsComponent/>}/>
          <Route path="product-add/:product_id" element={<ProductAddComponent/>}/>
          <Route path="product-add/" element={<ProductAddComponent/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
