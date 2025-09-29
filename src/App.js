import { useNavigate, Route,Routes } from 'react-router-dom';
import LoginComponent from './Components/Login';
import HomeComponent from './Components/Home';
import DashboardComponent from './Components/Dashboard';
import CategoriesComponent from './Components/Categories';
import CategoryAddComponent from './Components/Category-add';
import CategoryEditComponent from './Components/Category-edit';
import ProductAddComponent from './Components/Product-add';
import ProductsComponent from './Components/Products';
import SlideComponent from './Components/Slide';
import SlideMiddleComponent from './Components/SlideMiddle';
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Blog from './Components/Blog';
import BlogAdd from './Components/Blog-add';
import BlogEdit from './Components/Blog-edit';

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginComponent/>}/>
        <Route path="/home" element={<HomeComponent/>}>
          <Route index element={<DashboardComponent/>}/>
          <Route path="slides" element={<SlideComponent/>}/>
          <Route path="categories" element={<CategoriesComponent/>}/>
          <Route path="category-add" element={<CategoryAddComponent/>}/>
          <Route path="category-edit/:id" element={<CategoryEditComponent/>}/>
          <Route path="products" element={<ProductsComponent/>}/>
          <Route path="product-add" element={<ProductAddComponent/>}/>
          <Route path="product-add/:product_id" element={<ProductAddComponent/>}/>
          <Route path="slide-middle" element={<SlideMiddleComponent/>}/>
          <Route path="blog" element={<Blog />} />
          <Route path="blog/add" element={<BlogAdd />} />
          <Route path="blog/edit/:id" element={<BlogEdit />} />
        </Route>
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
