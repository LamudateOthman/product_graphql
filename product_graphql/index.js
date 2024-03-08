import { ApolloServer, gql ,InMemoryLRUCache  } from 'apollo-server';

 
// Schema definition
const typeDefs = gql`
type Query {
  getProduct(id: ID!): Product
  products(limit: Int, offset: Int): [Product!]!
  getCategories: [Category]
  getProductsByStoreId(storeId: String!, offset: Int = 0, limit: Int!): [Product!]!
}

type Mutation {
  
  addProduct(input: AddProductInput!): Product
  AddProducte(name: String!,storeId: String!,description: String!, category: String!, price: Float!,image:String, variants: [VariantInput!]!): Product
}

type Product {
  id: ID!
  storeId: String!
  name: String!
  description: String!
  category: String!
  subcategories: String!
  price: Float!
  variants: [Variant!]!
  image: String
}

type Category {
  id: ID!
  name: String!
  subcategories: [Category!]!
}

type Variant {
  id: ID!
  name: String!
  description: String!
  value: String!
  values: [VariantValue!]!
}
query fetchProducts($offset: Int, $limit: Int) {
  products(offset: $offset, limit: $limit) {
    id 
    storeId
    name 
    description 
    category 
    subcategories 
    price 
  }
}
query GetProductsByStoreId(\$storeId:  String!, \$offset: Int!, \$limit: Int!) {
  getProductsByStoreId(storeId:  \$storeId, offset: \$offset, limit: \$limit) {
    id
    name
    description
    category
    price
    image
    variants {
      id
      name
      description
      value
      values {
        id
        value
        price
        name
        stock
        image
      }
    }
  }
}
type VariantValue {
  id: ID!
  value: String!
  price: Float!
  name: String!
  stock: Int!
  image: String!
}

input AddProductInput {
  name: String!
  description: String!
  category: String!
  subcategories: String!
  price: Float!
  variants: [VariantInput!]!
}

input VariantInput {
  name: String!
  description: String!
  value: String!
  values: [VariantValueInput!]!
}

input VariantValueInput {
  value: String!
  price: Float!
  name: String!
  stock: Int!
  image: String!
}
`;

function generateMockProducts(numberOfProducts) {
  const products = [];
  const images=[
    'https://images.pexels.com/photos/18031818/pexels-photo-18031818/free-photo-of-hand-with-a-flower-casting-a-shadow-on-the-book.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/15202787/pexels-photo-15202787/free-photo-of-hand-holding-book-in-turkish.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/19802130/pexels-photo-19802130/free-photo-of-woman-holding-flowers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1643033/pexels-photo-1643033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/9270306/pexels-photo-9270306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2693644/pexels-photo-2693644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
  ];
  for (let i = 1; i <= numberOfProducts; i++) {
    const product = {
      id: i ,
      name: `Product ${i}`,
      storeId:  `${1007}`+"",
      description: `Description for Product ${i}`,
      category: `Category ${(i % 5) + 1}`, // Let's assume there are 5 categories
      price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
      image: images[Math.floor(Math.random() * 10)],
      variants: generateMockVariants(i), // Generate variants for each product
    };

    products.push(product);
  }

  return products;
}

function generateMockVariants(productId) {
  const numberOfVariants = Math.floor(Math.random() * 4) + 1; // Each product will have 1 to 4 variants
  const variants = [];
  const images=[
    'https://images.pexels.com/photos/18031818/pexels-photo-18031818/free-photo-of-hand-with-a-flower-casting-a-shadow-on-the-book.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/15202787/pexels-photo-15202787/free-photo-of-hand-holding-book-in-turkish.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/19802130/pexels-photo-19802130/free-photo-of-woman-holding-flowers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1643033/pexels-photo-1643033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/9270306/pexels-photo-9270306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2693644/pexels-photo-2693644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
  ];
  for (let i = 1; i <= numberOfVariants; i++) {
    const variant = {
      id: i,
      name: `Variant ${i} of Product ${productId}`,
      description: `This is Variant ${i}`,
      value: `Value ${i}`,
      values: [
        {
          id: i*Math.floor(Math.random() * 100),
          value: i,
          stock: Math.floor(Math.random() * 100) + 1, // Random stock quantity
          name: `Sub-variant ${i}-1`,
          price: Math.floor(Math.random() * 100) + 1, // Random price
          image: images[Math.floor(Math.random() * 10)],
        },
        {
          id:  i*Math.floor(Math.random() * 100),
          value: i,
          stock: Math.floor(Math.random() * 100) + 1, // Random stock quantity
          name: `Sub-variant ${i}-1`,
          price: Math.floor(Math.random() * 100) + 1, // Random price
          image: images[Math.floor(Math.random() * 10)],
        },
        {
          id:  i*Math.floor(Math.random() * 100),
          value: i,
          stock: Math.floor(Math.random() * 100) + 1, // Random stock quantity
          name: `Sub-variant ${i}-1`,
          price: Math.floor(Math.random() * 100) + 1, // Random price
          image: images[Math.floor(Math.random() * 10)],
        },
      ],
    };
    variants.push(variant);
  }

  return variants;
}

// Example usage
const products = generateMockProducts(10); 


const categories = [
  {
    id: "1",
    name: "Electronics",
    subcategories: [
      { id: "1-1", name: "Smartphones" },
      { id: "1-2", name: "Laptops" },
      { id: "1-3", name: "Tablets" }
    ]
  },
  {
    id: "2",
    name: "Clothing",
    subcategories: [
      { id: "2-1", name: "Men's Wear" },
      { id: "2-2", name: "Women's Wear" },
      { id: "2-3", name: "Children's Wear" }
    ]
  },
  {
    id: "3",
    name: "Home & Kitchen",
    subcategories: [
      { id: "3-1", name: "Furniture" },
      { id: "3-2", name: "Cookware" },
      { id: "3-3", name: "Decor" }
    ]
  }
  // Add more categories and subcategories as needed
];

// Resolvers
const resolvers = {
  Query: {
    getProduct: (_, { id }) => products.find(product => product.id === id),
    products: (_, { limit, offset }) => {
      const slicedProducts = products.slice(offset, offset + limit);
      return slicedProducts;
    },


    getProductsByStoreId: (_, { storeId, offset, limit }) => {
      // Example: Fetching products from an in-memory array. Adjust this to your data fetching logic.
      const filteredProducts = products.filter(product => product.storeId === storeId);
      
      // Apply offset and limit
      return filteredProducts.slice(offset, offset + limit);
    },
    


    getCategories: () => categories,
  },
  Category: {
    subcategories: (parent) => parent.subcategories.map(subcategory => ({
      ...subcategory,
      subcategories: []
    })),
  },
  Mutation: {
    addProduct: (_, { input }) => {
      const newProduct = { id: Date.now().toString(), ...input, variants: input.variants };
      products.push(newProduct);
      return newProduct;
    },

    AddProducte: async (_, { name, storeId, description, category, price, variants, image }) => {
      // Generate a new product ID
      const newProductId = products.reduce((maxId, product) => Math.max(maxId, parseInt(product.id)), 0) + 1;
    
      // Initialize an ID counter for variants and variant values to ensure uniqueness
      let variantIdCounter = 1;
      let valueIdCounter = 1;
    
      // Construct the new product with variants and their values
      const newProduct = {
        id: newProductId.toString(),
        name,
        storeId,
        description,
        category,
        price,
        image,
        variants: variants.map((variant) => {
          const variantId = newProductId.toString() + '-' + (variantIdCounter++).toString();
    
          return {
            id: variantId,
            name: variant.name,
            description: variant.description,
            value: variant.value,
            values: variant.values.map((value) => {
              const valueId = variantId + '-' + (valueIdCounter++).toString();
              return {
                id: valueId,
                value: value.value,
                stock: value.stock,
                name: value.name,
                price: value.price,
                image: value.image,
              };
            }),
          };
        }),
      };
    
      // Assuming you have a mechanism to add this newProduct to your data store
      // For example, if `products` is an in-memory array you're using for storage, you would do:
      products.push(newProduct);
    
      // Return the newly created product object
      return newProduct;
    }
    
  },
 
};

// Creating Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    cache: new InMemoryLRUCache({
        maxSize: 10000000, // Adjust the size according to your app's needs
        ttl: 60000, // Cache entry TTL in milliseconds
    }),
    // other configurations
});


// Starting the server
const PORT = process.env.PORT || 4003; // Fallback to 4003 if the PORT variable isn't set
server.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
});
