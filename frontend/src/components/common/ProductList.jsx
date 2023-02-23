import React from 'react';
import ProductListItem from './ProductListItem';

import tw, { styled, css } from 'twin.macro';

const ListWrapper = styled.div`
  ${tw`border-t-4 mt-[60px] overflow-scroll`}
  ${css`
    height: calc(100vh - 218px);
  `}
`;

function ProductList({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null; // or return an empty component like <></>
  }
  return (
    <ListWrapper id="list-wrapper">
      {items
        ? items.map(item => (
            <div key={item.itemIdx}>
              <ProductListItem item={item} checkShow={false} />
            </div>
          ))
        : ''}
      <hr />
    </ListWrapper>
  );
}

export default ProductList;
