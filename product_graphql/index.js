import { ApolloServer, gql   } from 'apollo-server';

 
const typeDefs = gql`
type Query {
  getProduct(id: ID!): Product
  products(limit: Int, offset: Int): [Product!]!
  getCategories: [Category]!
  getProductsByStoreId(storeId: String!, offset: Int = 0, limit: Int!): [Product!]!
  stores(limit: Int, offset: Int): [Store!]!
  storesF(where: StoreWhereInput): [Store]
}

type Mutation {
  
  addProduct(input: ProductInput!): Product
  AddProducte(name: String!,storeId: String!,description: String!, category: String!, price: Float!,image:String, variants: [VariantInput!]!): Product
  updateProduct(product: ProductInput!): Product
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
  name: String!
  icon: String
  color: String
}

type Variant {
  id: ID!
  name: String!
  price: Float!
  image: String!
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
      image
      price
      values {
        id
        keysValues
        values
      }
    }
  }
}
  
    
type VariantValue {
  id: ID!
  keysValues: String!
  values: String!
  
}

input AddProductInput {
  name: String!
  description: String!
  category: String!
  subcategories: String!
  price: Float!
  variants: [VariantInput!]!
}
input ProductInput {
  id: ID!
  name: String!
  description: String!
  category: String!
  price: Float!
  image: String
  variants: [VariantInput!]!
}

input VariantInput {
  id: ID!
  name: String!
  price: Float!
  image: String!
  values: [VariantValueInput!]!
}

input VariantValueInput {
  id: ID!
  keysValues: String!
  values: String!
 
}


type Store {
  id: Int!
  title: String!
  author: String!
  city: String!
  description: String!
  logo: String!
  image: [String]!
  categories: [String]!
  numberOfProducts: Int!
  hasOffer: Boolean!
  numberOfKilometres: Float!
}


input StoreInput {
  title: String!
  author: String!
  city: String!
  description: String!
  logo: String!
  image: [String]!
  categories: [String]!
  numberOfProducts: Int!
  hasOffer: Boolean!
  numberOfKilometres: Float!
}

query FetchStores($offset: Int, $limit: Int) {
  stores(offset: $offset, limit: $limit) {
    id
    title
    author
    city
    description
    logo
    image
    categories
    numberOfProducts
    hasOffer
    numberOfKilometres
  }
}
input StoreWhereInput {
  numberOfKilometres: FloatFilter
}

input FloatFilter {
  lt: Float
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
      storeId:  `${1007}`,
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
      price: Math.floor(Math.random() * 100) + 1,
      image: images[Math.floor(Math.random() * 10)],
      values: [
        {
          id: i*Math.floor(Math.random() * 100),
          keysValues:`variant ${i}` ,
         values:`variant ${i} value`,
           
        },
        {
          id: i*Math.floor(Math.random() * 100),
          keysValues:`variant ${i}` ,
         values:`variant ${i} value`,
           
        },
       {
          id: i*Math.floor(Math.random() * 100),
          keysValues:`variant ${i}` ,
         values:`variant ${i} value`,
           
        },
      ],
    };
    variants.push(variant);
  }

  return variants;
}

// Example usage
const products = generateMockProducts(10); 

const categories =[
  {
    "name": "Books",
    "icon": "bookOpen",
    "color": "FFDBB2D1" // A soft pink
  },
  {
    "name": "Music",
    "icon": "music",
    "color": "FF90CAF9" // Light blue
  },
  {
    "name": "Travel",
    "icon": "train",
    "color": "FFFFAB91" // Light orange
  },
  {
    "name": "Fitness",
    "icon": "toolbox",
    "color": "FFA5D6A7" // Light green
  },
  {
    "name": "Technology",
    "icon": "laptop",
    "color": "FFCE93D8" // Light purple
  },
  {
    "name": "Box",
    "icon": "box",
    "color": "FFFFE082" // Yellow
  },
  {
    "name": "Drinks",
    "icon": "bottleWater",
    "color": "FFEF9A9A" // Soft red
  }
]
;
const stores = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Store ${i + 1}`,
  author: `Author ${Math.floor(Math.random() * 100) + 1}`,
  city: `City ${Math.floor(Math.random() * 100) + 1}`,
  description: `This is store ${i + 1} description.`,
  logo: `https://images.pexels.com/photos/12428121/pexels-photo-12428121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  image:[ `https://images.pexels.com/photos/12428121/pexels-photo-12428121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`],
  categories: ["Electronics", "Books"], // Example categories
  numberOfProducts: Math.floor(Math.random() * 100) + 1,
  hasOffer: Math.random() < 0.5,
  numberOfKilometres: parseFloat((Math.random() * 10).toFixed(2)),
}));
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
    

    stores: (_, { limit = 10, offset = 0 }) => {
      const slicedStores = stores.slice(offset, offset + limit);
      return slicedStores;
    },
    storesF: (_, { where }) => {
      return stores.filter(store => (!where.numberOfKilometres || store.numberOfKilometres < where.numberOfKilometres.lt));
    },
    getCategories: () => categories,
  },
 
  Mutation: {
    addProduct: (_, { input }) => {
      const newProduct = { id: Date.now().toString(), ...input, variants: input.variants };
      products.push(newProduct);
      return newProduct;
    },
  updateProduct: (_, { product }) => {
        const productIndex = products.findIndex(p => p.id === product.id);
        if (productIndex === -1) {
            throw new Error('Product not found');
        }

        // Merge the existing product info with the updated info
        products[productIndex] = { ...products[productIndex], ...product };
        return products[productIndex];
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
            price: variant.price,
            image: variant.image,
            values: variant.values.map((value) => {
              const valueId = variantId + '-' + (valueIdCounter++).toString();
              return {
                id: valueId,
                values: value.values,
                keysValues: value.keysValues,
             
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
     persistedQueries: false,
});


// Starting the server
const PORT = process.env.PORT || 4003; // Fallback to 4003 if the PORT variable isn't set
server.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
});
