/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
import {graphql} from 'gatsby';
import {Layout,ImageGallery} from 'components';
import { Grid, SelectWrapper, Price } from './styles';
import CartContext from 'context/CartContext';
import { navigate, useLocation } from '@reach/router';
import queryString from 'query-string';

export const query = graphql`
    query ProductQuery($shopifyId: String){
        shopifyProduct(shopifyId: {eq: $shopifyId}) {
            shopifyId
            title
            description
            images {
                id
                localFile {
                  size
                  childImageSharp {
                    fluid(maxWidth: 300) {
                      ...GatsbyImageSharpFluid_withWebp
                    }
                  }
                }
              }
        }
    }
`

export default function ProductTemplate({data}) {
  const { getProductById} = React.useContext(CartContext);
  const [product, setProduct] = React.useState(null);
  const [selectedVariant, setSelectedVariant] = React.useState(null);
  const { search, origin, pathname } = useLocation();
  const variantId = queryString.parse(search).variant;

  React.useEffect(()=>{
    getProductById(data.shopifyProduct.shopifyId).then(result => {
      setProduct(result);
      setSelectedVariant(
        result.variants.find(({ id }) => id === variantId) || result.variants[0]
      );
    })
  },[getProductById,setProduct,data.shopifyProduct.shopifyId,variantId])

  const handleVariantChange = e => {
    const newVariant = product?.variants.find(v => v.id === e.target.value);
    setSelectedVariant(newVariant);
    navigate(
      `${origin}${pathname}?variant=${encodeURIComponent(newVariant.id)}`,
      {
        replace: true,
      }
    );
  };

    return (
        <Layout>
        <Grid>
        <div>
            <h1>{data.shopifyProduct.title}</h1>
            <p>{data.shopifyProduct.description}</p>
            {product?.availableForSale && (
            <>
              {product?.variants.length > 1 && (
                <SelectWrapper>
                  <strong>Variant</strong>
                  <select
                    value={selectedVariant?.id}
                    onChange={handleVariantChange}
                  >
                    {product?.variants.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.title}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              )}
                 {!!selectedVariant && ( <> <Price>£{selectedVariant?.price}</Price> </>)}
            </>
          )}
        </div>
        <div>
            <ImageGallery selectedVariantImageId={selectedVariant?.image.id} images={data.shopifyProduct.images}/>
        </div>
        </Grid>
        </Layout>
    )
}
