import React from 'react';

function Category() {

    const [categories, setCategories] = React.useState([]);

  function fetchCategories() {
    fetch('http://localhost/cakribazar/category/index.php')
      .then(response => response.json())
      .then(data => setCategories(data.data))
      .catch(error => console.error('Error fetching categories:', error));
  }

  React.useEffect(() => {
    fetchCategories();
  }
, [categories]);

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">Explore By Category</h1>
                <div className="row g-4">
                    {categories.map(category => (
                    <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                        <a className="cat-item rounded p-4" href="">
                            <i className="fa fa-3x fa-mail-bulk text-primary mb-4"></i>
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