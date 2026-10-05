import { useState, useEffect } from 'react'

function Carousel({ slides }) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [slides.length])

    const slide = slides[current]

    return (
        <div className="container-fluid p-0">
            <div className="position-relative" key={current}>
                <img className="img-fluid w-100" src={slide.image} alt="" />
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{background: 'rgba(43, 57, 64, .5)'}}>
                    <div className="container">
                        <div className="row justify-content-start">
                            <div className="col-10 col-lg-8">
                                <h1 className="display-3 text-white animated slideInDown mb-4">{slide.title}</h1>
                                <p className="fs-5 fw-medium text-white mb-4 pb-2">{slide.text}</p>
                                <a href="" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Search A Job</a>
                                <a href="" className="btn btn-secondary py-md-3 px-md-5 animated slideInRight">Find A Talent</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carousel;