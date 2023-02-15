import React, { useState, useEffect, Suspense, lazy } from "react";
import { useSelector, connect } from "react-redux";
import { debounce } from 'lodash';

const FeaturedRecipeList = lazy(() => import("./FeaturedRecipeList"));
const Loading = () => <div></div>;

function FeatureBar(props) {
  var featuredRecipes = useSelector((state) => state.featuredRecipes )
  const [ carouselOpen, setCarouselOpen] = React.useState(false)

  const toggleCarousel = (e) => {
    setCarouselOpen(!carouselOpen)
  };

  return (
    <div className="FeatureBarContainer" >

      <div className={carouselOpen ? '' : 'carouselClosed'} id='carousel'>
        <div className="FeatureCarousel">
          <div className="featureButton" onClick={e => {
            e.preventDefault();
            toggleCarousel()
          }}>= <span className="featuredLabel">Featured Recipes</span></div>

          <Suspense fallback=<Loading/>>
            <FeaturedRecipeList />
          </Suspense>
        </div>

      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    featuredRecipes: state.featuredRecipes,
    carouselOpen: state.carouselOpen
  };
}

export default connect(mapStateToProps)(FeatureBar);
