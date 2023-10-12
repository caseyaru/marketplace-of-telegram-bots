import React, { useState } from 'react';
import './ProductDetail.css';
import ProductPhotos from '../ProductPhotos/ProductPhotos';
import award from '../../../images/Pixel-36.svg';
import ProductDescription from '../ProductDescription/ProductDescription';
import ProductReviews from '../ProductReviews/ProductReviews';

const ProductDetail = ({ card, handleFullScreenClick, reviews }) => {
  const [state, setState] = useState('description');

  function handleDescClick() {
    setState('description');
  }

  function handleReviewClick() {
    setState('review');
  }

  return (
    <div className='product__good-detail'>
      <ProductPhotos card={card} handleFullScreenClick={handleFullScreenClick} />
      <div className='product__good-award'>
        <img className='product__good-prize' src={award} alt='награда' />
        <h2 className='product__good-heading'>Лучший продавец ботов</h2>
      </div>
      <div className='product__good-items'>
        <h3 className={`product__good-item ${state === 'description' ? 'product__good-item_active' : 'product__good-item product'}`} onClick={handleDescClick}>Описание</h3>
        <h3 className={`product__good-item ${state === 'review' ? 'product__good-item_active' : 'product__good-item product'}`} onClick={handleReviewClick}>{`Отзывы (${reviews.length})`}</h3>
      </div>
      {state === 'description' && <ProductDescription card={card} />}
      {state === 'review' && <ProductReviews reviews={reviews} />}
    </div>
  );
};

export default ProductDetail;