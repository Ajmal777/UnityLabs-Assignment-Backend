<h1 align="center">E-Commerce API</h1>

## Getting started
Clone the repository and run the following command in the CLI to install all the dependencies.
```
npm install
```


## Usage
Before starting the server, you need to create a ``.env`` file then create following environment variables:

- `PORT` (Number) : Port number on which the server will run <br>
- `MONGO_URI` (String) : Your mongodb database connection string <br>
- `JWT_KEY` (String) : Serves as a key for jwt authentication <br>
- `BCRYPT_SALT` (Number) : Salt rounds for password encryption <br>

To start the server, run the following in the CLI: 
```
node index.js
```

## Endpoints
### Auth
Contains endpoints to register or login as a buyer or seller.
- #### Register
  Register as a buyer or seller
  - <b>Body: </b>
    - `username` (String)
    - `password` (String)
    - `typeOfUser` (String) : should be either `buyer` or `seller` (case-sensitive).
  <br>

  ```
  POST /api/auth/register

  body: 
  {
    "username" : "username",
    "password" : "password",
    "typeOfUser : "buyer"   // or "seller"
  }
  ```
  #### Example usage:
  ```
  POST /api/auth/register

  {
    "username" : "John_Doe",
    "password" : "John_Doe_123",
    "typeOfUser" : "buyer"
  }
  ```
  <br>
- #### Login
  Login as a buyer or seller
  - <b>Body: </b>
    - `username` (String)
    - `password` (String)
    - `typeOfUser` (String) : should be either `buyer` or `seller` (case-sensitive).
  <br>

  ```
  POST /api/auth/login

  body: 
  {
    "username" : "registered username",
    "password" : "registered password",
    "typeOfUser : "buyer"   // or "seller"
  }
  ```
  #### Example usage:
  ```
  POST /api/auth/login

  {
    "username" : "John_Doe",
    "password" : "John_Doe_123",
    "typeOfUser" : "buyer"
  }
  ```
  <br>
### Buyers
These endpoints are for users registered as buyers
- #### List of sellers
  Gets a list of all sellers
  <br>

  ```
  GET /api/buyer/list-of-sellers
  ```
  #### Example usage:
  ```
  GET /api/buyer/list-of-sellers
  ```
- #### Seller catalog
  Gets the catalog of a seller
  - <b>Parameters: </b>
    - `seller_id` (String) : userId of the seller
  <br>

  ```
  GET /api/buyer/seller-catalog/:seller_id
  ```
  #### Example usage:
  ```
  GET /api/buyer/seller-catalog/657711be546430d5e719ed78
  ```
  <br>
- #### Create order
  Creates a new order with a list of items to buy from the seller's catalog
  - <b>Parameters: </b>
    - `seller_id` (String) : userId of the seller. (Get the seller id from the database)
  - <b>Body: </b>
    - `orderList` (Array) : An array of `product_id`
      - `product_id` (String) : Product id of the product the user wants to order. (Get the product id from database)
  <br>

  ```
  POST /api/buyer/create-order/:seller_id

  body:
  {
    "orderList" : [ "product_id_1", "product_id_2" ]
  }
  ```
  
  #### Example usage:
  ```
  POST /api/buyer/create-order/657711be546430d5e719ed78
  {
   "orderList" : ["6577335642be759376068863", "6577335642be759376068862"]
  }
  ```
  <br>
### Sellers
These endpoints are for sellers only
- #### Create catalog
  Creates and initializes a catalog with a list of products
  - <b>Body: </b>
    - `productsList` (Array) - Contains an array of product Objects
      - `name` (String) - Specifies the name of the product
      - `price` (Number) - Price of the product
  <br>

  ```
  POST /api/seller/create-catalog

  body:
  {
    "productsList" : {
        { "name" : "productName", "price" : (product price) }
     }
  }
  ```
  #### Example usage
  ```
  POST /api/seller/create-catalog

  {
    "productsList" : {
      { "name" : "LED TV", "price": 58000 },
      { "name" : "Smartphone", "price": 32000 }
    }
  }
  ```
  <br>
- #### Orders
  Gets all the orders recieved by the seller
  <br>
  ```
  GET /api/seller/orders
  ```
  #### Example usage
  ```
  GET /api/seller/orders
  ```
  <br>
- #### Create product
  Create a new product and adds it to the seller's catalog
  - <b>Body: </b>
    - `name` (String) : Name of the product.
    - `price` (Number) : Price of the product.
  <br>
  
  ```
  POST /api/seller/create-product

  body:
  {
    "name" : "product name",
    "price": (product price)
  }
  ```
  #### Example usage
  
  ```
  {
    "name" : "QLED TV",
    "price": 130000 
  }
  ```
  <br>





