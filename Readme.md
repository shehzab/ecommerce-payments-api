
# E-Commerce / Payments API

A complete, RESTful e-commerce backend API with Stripe payment integration, built with Node.js, Express, and MongoDB.

---

## 🚀 Features

- **User Authentication** – JWT-based registration/login system  
- **Role-Based Access Control (RBAC)** – Admin and user roles with proper permissions  
- **Product Management** – Full CRUD operations with filtering, sorting, and pagination  
- **Shopping Cart** – Add, update, remove items with stock validation  
- **Order System** – Complete order processing with status tracking  
- **Payment Integration** – Stripe Payment Intents, webhook handling, and test card support  
- **Admin Dashboard** – User management, order tracking, and sales analytics  
- **Security** – Helmet, CORS, rate limiting, input validation  
- **Testing** – Jest and Supertest for unit and integration tests  

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express.js  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication:** JWT with bcryptjs  
- **Payments:** Stripe API  
- **Security:** Helmet, CORS, Rate Limiting  
- **Testing:** Jest & Supertest  

---

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ecommerce-payments-api.git
cd ecommerce-payments-api
````

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/ecommerce_db

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
FRONTEND_URL=http://localhost:3000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start the development server:

```bash
npm run dev
```

---

## 🗄️ Database Setup

* MongoDB collections and indexes are auto-created on first run.
* Optionally, seed the database with default roles/products if implemented.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                   | Description         | Access  |
| ------ | -------------------------- | ------------------- | ------- |
| POST   | `/api/auth/register`       | Register a new user | Public  |
| POST   | `/api/auth/login`          | Login user          | Public  |
| GET    | `/api/auth/me`             | Get current user    | Private |
| PUT    | `/api/auth/updatedetails`  | Update user details | Private |
| PUT    | `/api/auth/updatepassword` | Update password     | Private |

### Products

| Method | Endpoint            | Description                               | Access |
| ------ | ------------------- | ----------------------------------------- | ------ |
| GET    | `/api/products`     | Get all products (filter/sort/pagination) | Public |
| GET    | `/api/products/:id` | Get single product                        | Public |
| POST   | `/api/products`     | Create product                            | Admin  |
| PUT    | `/api/products/:id` | Update product                            | Admin  |
| DELETE | `/api/products/:id` | Delete product                            | Admin  |

### Cart

| Method | Endpoint                  | Description      | Access  |
| ------ | ------------------------- | ---------------- | ------- |
| GET    | `/api/cart`               | Get user cart    | Private |
| POST   | `/api/cart/items`         | Add item to cart | Private |
| PUT    | `/api/cart/items/:itemId` | Update cart item | Private |
| DELETE | `/api/cart/items/:itemId` | Remove item      | Private |
| DELETE | `/api/cart`               | Clear cart       | Private |

### Orders

| Method | Endpoint                  | Description             | Access  |
| ------ | ------------------------- | ----------------------- | ------- |
| GET    | `/api/orders`             | Get user orders         | Private |
| GET    | `/api/orders/:id`         | Get single order        | Private |
| POST   | `/api/orders`             | Create new order        | Private |
| PUT    | `/api/orders/:id/pay`     | Mark order as paid      | Private |
| PUT    | `/api/orders/:id/deliver` | Mark order as delivered | Admin   |

### Payments

| Method | Endpoint                                | Description                   | Access  |
| ------ | --------------------------------------- | ----------------------------- | ------- |
| POST   | `/api/payments/create-payment-intent`   | Create payment intent         | Private |
| POST   | `/api/payments/confirm-payment`         | Confirm payment (for testing) | Private |
| GET    | `/api/payments/intent/:paymentIntentId` | Get payment status            | Private |
| POST   | `/api/payments/webhook`                 | Stripe webhook handler        | Public  |

### Admin

| Method | Endpoint                 | Description     | Access |
| ------ | ------------------------ | --------------- | ------ |
| GET    | `/api/admin/users`       | Get all users   | Admin  |
| GET    | `/api/admin/users/:id`   | Get user by ID  | Admin  |
| PUT    | `/api/admin/users/:id`   | Update user     | Admin  |
| DELETE | `/api/admin/users/:id`   | Delete user     | Admin  |
| GET    | `/api/admin/orders`      | Get all orders  | Admin  |
| GET    | `/api/admin/sales-stats` | Sales analytics | Admin  |

---

## 💳 Stripe Payment Integration

* **Payment Intents** are used for secure payments.
* Stripe webhooks automatically update order status.
* Test cards for local testing:

  * `4242 4242 4242 4242` – Successful payment
  * `4000 0025 0000 3155` – Authentication required
  * `4000 0000 0000 0002` – Payment declined
* Local webhook testing:

```bash
stripe login
stripe listen --forward-to localhost:5000/api/payments/webhook
```

* Environment variables required in `.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

---

## 🧪 Testing

* Run all tests:

```bash
npm test
```

* Watch mode:

```bash
npm run test:watch
```

* Postman: Import `/docs/postman-collection.json`
  Set environment variables:

```text
baseUrl = http://localhost:5000/api
authToken = (will be set dynamically after login)
```

---

## 🔐 Authentication

* JWT tokens are required for private routes:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔮 Future Enhancements

* Product reviews & ratings
* Wishlist functionality
* Email notifications for order updates
* Advanced inventory & discount system
* Redis caching for performance
* Docker support & deployment automation
* GraphQL API alternative

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m "Add AmazingFeature"`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT License – see [LICENSE](LICENSE)

---

## 🆘 Support

* Contact: [sinanshehzab@gmail.com](mailto:sinanshehzab@gmail.com)
* GitHub Issues: [Open an Issue](https://github.com/your-username/ecommerce-payments-api/issues)

---

**Built with ❤️ using Node.js, Express, MongoDB, and Stripe**



