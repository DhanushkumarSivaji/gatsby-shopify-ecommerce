import React from 'react';
import {graphql} from 'gatsby';
import {Layout,ImageGallery} from 'components';
import {Grid} from './styles';

export const query = graphql`
    query ProductQuery($shopifyId: String){
        shopifyProduct(shopifyId: {eq: $shopifyId}) {
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
    return (
        <Layout>
        <Grid>
        <div>
            <ImageGallery  images={data.shopifyProduct.images}/>
        </div>
        <div>
            <h1>{data.shopifyProduct.title}</h1>
            <p>{data.shopifyProduct.description}</p>
        </div>
        
        </Grid>
        </Layout>
    )
}
