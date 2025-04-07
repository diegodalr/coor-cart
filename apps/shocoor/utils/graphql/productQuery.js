const productQuery = `query products {
  products(first: 5) {
    edges {
      node {
        id,
        title,
        featuredImage {
          url
        },
        variants (first: 1) {
          edges {
            node {
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
}`;

export default productQuery;