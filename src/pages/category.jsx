import React from 'react';
import axios from '../Lib/axios.js';
function Category() {

    const [categories, setCategories] = React.useState([]);

  function fetchCategories() {
  axios.get('http://localhost/cakribazar/category/index.php')
    .then(response => setCategories(response.data.data))
    .catch(error => console.error('Error fetching categories:', error));
}

React.useEffect(() => {
  fetchCategories();
}, []);

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">Explore By Category</h1>
                <div className="row g-4">
                    {categories.map(category => (
                    <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                        <a className="cat-item rounded p-4" href="">
                            <p><img src={`${import.meta.env.VITE_API_URL}${category.icon}`} alt={category.name} width="30" /></p>
                            <h6 className="mb-3">{category.name}</h6>
                            <p className="mb-0">{category.description}</p>
                        </a>
                    </div>
                    ))}
                    
                </div>
            </div>
        </div>
    );
}

export default Category;