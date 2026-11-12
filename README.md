# Online Shopping & Inventory

An academic storefront and inventory demo built with **React, JavaScript, Express, and MySQL**. This copy is based on the original `kavyakorem/online-shopping` project.

- Browse products by category and see stock availability from the REST API.
- Add and remove products from a cart stored in the browser and review quantities and totals.
- Manage inventory through Express endpoints for listing, creating, updating, and deleting products.
- The API has a separate checkout endpoint that attempts to reserve stock with guarded SQL updates inside a transaction. The browser checkout is a mock flow; it does not submit the cart to that endpoint or collect payment.

## Run locally

Use Node.js 20 or newer and a local MySQL instance. Create a database account with permission to create and use `inventory_db`. The original Node MySQL driver requires a server authentication method it supports.

```sh
cp .env.example .env
# Set DB_USER and DB_PASSWORD for your local database.
npm ci
node dbsetup.js
npm start
```

Run the storefront in a second terminal:

```sh
cd inventory-frontend
npm ci
npm start
```

Open http://localhost:3000. The API listens on http://localhost:5000 by default. Run the sample-data initializer once for a fresh database. This demo is intended for local use with sample data.
