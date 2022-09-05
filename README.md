# Valex API 💳

## Table of Contents
- [Project Description](#project-description)
- [Technologies](#technologies)
- [Running the project](#running-the-project)
- [Features](#features)
    * [Card Creation](#card-creation)
    * [Card Activation](#card-activation)
    * [Card Blocking](#card-blocking)
    * [Card Unblocking](#card-unblocking)
    * [Card Recharge](#card-recharge)
    * [Card Balance](#card-balance)
    * [POS Payment](#pos-payment)
    * [Online Payment](#online-payment)

## Project Description
**Valex** is a voucher card API.
The API is responsible for creating, reloading, activating, as well as processing purchases.

![status-finished](https://user-images.githubusercontent.com/97575616/152926720-d042178b-24c0-4d6b-94fb-0ccbd3c082cc.svg)

## Technologies
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## Running the project

1. Clone the repository:

    ```bash
    git clone https://github.com/akiraTatesawa/valex-API.git
    ```
2. Navigate to the project directory:
    
    ```bash
    cd valex-API
    ```
3. Install the dependencies:
    
    ```bash
    npm install
    ```
4. Navigate to the postgres db directory and install the database:
    
    ```bash
    cd src/dbStrategy/postgres/database
    
    bash ./create-database 
    ```
5. Set your environment variables following the .env.sample file:

   ```ts
    PORT=
    DATABASE_URL=
    CRYPTR_SECRET_KEY=
   ```
6. Run the project on dev mode

   ```bash
   npm run dev
   ```

## Features

**Notes:**
- `cardType` must only assume the following values: 'groceries', 'restaurants', 'transport', 'education', 'health';
- `employeeId` must be a valid employee id;
- `x-api-key` must be a valid company key;
- `password` must be a string made up of four numbers;
- `CVC` must be a string made up of 3 numbers and must be a valid card CVC;
- `amount` must be an integer greater than zero;

### Card Creation

- **Endpoint**: 
   ```http
   POST /cards/create
   ```
- **Request Body**: 
   ```json
  {
    "cardType": "health",
    "employeeId": 2
  }
  ```
- **Request Header**: `x-api-key: "key.example.123"`
- **Response Example**:
    ```json
    {
      "cardId": 3,
      "number": "7175-2620-5613-5534",
      "cardholderName": "CICLANA M MADEIRA",
      "securityCode": "074",
      "expirationDate": "09/27",
      "type": "health"
    }
    ```
    
### Card Activation

- **Endpoint**: 
   ```http
   PATCH /cards/:cardId/activate
   ```
- **Request Body**: 
   ```json
  {
    "password": "1234",
    "CVC": "123"
  }
  ```

### Card Blocking

- **Endpoint**: 
   ```http
   PATCH /cards/:cardId/block
   ```
- **Request Body**: 
   ```json
  {
    "password": "1234"
  }
  ```

### Card Unblocking

- **Endpoint**: 
   ```http
   PATCH /cards/:cardId/unblock
   ```
- **Request Body**: 
   ```json
  {
    "password": "1234"
  }
  ```
  
### Card Recharge

- **Endpoint**: 
   ```http
   POST /cards/:cardId/recharge
   ```
- **Request Body**: 
   ```json
  {
    "amount": 1000
  }
  ```
- **Request Header**: `x-api-key: "key.example.123"`

### Card Balance

- **Endpoint**: 
   ```http
   GET /cards/:cardId/balance
   ```
- **Response Example**:
    ```json
    {
        "balance": 800,
        "transactions": [
            {
                "id": 2,
                "cardId": 3,
                "businessId": 5,
                "timestamp": "2022-09-05T04:29:35.000Z",
                "amount": 200,
                "businessName": "Unimed"
            }
        ],
        "recharges": [
            {
                "id": 1,
                "cardId": 3,
                "timestamp": "2022-09-05T04:28:12.000Z",
                "amount": 1000
            }
        ]
    }
    ```

### POS Payment

**Notes:** The card type must be the same as the business type.

- **Endpoint**: 
   ```http
   POST /payments/pos
   ```
- **Request Body**: 
   ```json
  {
    "cardId": 2,
    "password": "1234",
    "businessId": 5,
    "amount": 100
  }
  ```

### Online Payment

**Notes:** The card type must be the same as the business type.

- **Endpoint**: 
   ```http
   POST /payments/online
   ```
- **Request Body**: 
   ```json
  {
    "cardInfo": {
        "cardNumber": "7175-2620-5613-5534",
        "cardholderName": "CICLANA M MADEIRA",
        "expirationDate": "09/27",
        "CVC": "053"
    },
    "businessId": 5,
    "amount": 100
  }
  ```
### Virtual Card Creation

- **Endpoint**: 
   ```http
   POST /cards/virtual/create
   ```
- **Request Body**: 
   ```json
  {
    "originalCardId": 2,
    "password": "1234"
  }
  ```
- **Response Example**:
    ```json
    {
      "cardId": 3,
      "number": "6771-8953-1311-4172",
      "cardholderName": "CICLANA M MADEIRA",
      "securityCode": "094",
      "expirationDate": "09/27",
      "type": "health"
    }
    ```

## Virtual Card Deletion

- **Endpoint**: 
   ```http
   DELETE /cards/virtual/delete
   ```
- **Request Body**: 
   ```json
  {
    "virtualCardId": 3,
    "password": "1234"
  }
  ```
