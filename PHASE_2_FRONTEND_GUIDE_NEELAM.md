# Shopster Phase 2 Frontend Guide - Neelam

## Goal Of Phase 2

Phase 1 is admin login, admin registration, and admin product CRUD.

Phase 2 introduces the buyer side of Shopster:

- Buyer registration
- Buyer login
- Buyer profile CRUD
- Buyer product browsing
- Buyer cart

Orders and payments are not part of Phase 2. Keep them for Phase 3.

## Your Branch

Work only on your own frontend branch.

Before starting work:

1. Pull the latest project code.
2. Switch to your branch.
3. Run the frontend locally.
4. Make sure Phase 1 still works before adding Phase 2.

Do not edit backend files from the frontend branch.

## Important Rule

Do not duplicate admin pages and only change small text.

Admin and buyer are different users:

- Admin manages products.
- Buyer browses products and manages cart.

Build buyer pages clearly so the app feels like a shopping experience, not an admin dashboard.

## Existing Frontend Structure

You will mostly work inside:

- `src/pages`
- `src/component`
- `src/context`
- `src/api`
- `src/route`
- `src/App.jsx`

Before creating a new file, check if a similar file already exists.

## API Planning

The backend team will create buyer and cart APIs.

Ask Vikram and Jeet for the final API routes before connecting the UI.

Expected route groups may look like:

- `/api/buyer/register`
- `/api/buyer/login`
- `/api/buyer/profile`
- `/api/cart`

Do not hardcode fake data permanently. Temporary data is okay only while waiting for backend APIs.

## Step 1 - Create Buyer Routes

Add frontend routes for buyer pages.

Suggested pages:

- `/buyer/register`
- `/buyer/login`
- `/shop`
- `/shop/product/:id`
- `/cart`
- `/buyer/profile`

Keep admin routes as they are.

Do not break:

- `/login`
- `/register`
- `/`
- `/products`
- `/addproduct`
- `/updateproduct/:id`

## Step 2 - Create Buyer Auth Pages

Create buyer registration and login pages.

Buyer registration form should collect:

- Name
- Email
- Password
- Confirm password
- Phone number, if backend supports it
- Address, if backend supports it

Buyer login form should collect:

- Email
- Password

Beginner checklist:

1. Create a buyer register page.
2. Create a buyer login page.
3. Add both pages to `App.jsx`.
4. Add form state using `useState`.
5. Add basic validation before API call.
6. Call the backend API.
7. Store the buyer token separately from admin token if backend gives separate auth.
8. Redirect buyer to `/shop` after successful login.

Do not store password in localStorage.

## Step 3 - Separate Admin And Buyer Login State

The current admin token uses localStorage.

For Phase 2, keep admin and buyer auth separate.

Suggested localStorage keys:

- `adminToken`
- `buyerToken`

If you change the current admin key, also update admin protected routes carefully.

Beginner checklist:

1. Check where `token` is currently used.
2. Decide whether to keep admin as `token` or rename it to `adminToken`.
3. Make a separate buyer protected route.
4. Test admin login after changes.
5. Test buyer login after changes.

## Step 4 - Create Buyer Protected Route

Create a route wrapper for buyer-only pages.

Buyer protected pages:

- `/cart`
- `/buyer/profile`

Public buyer pages:

- `/buyer/register`
- `/buyer/login`
- `/shop`
- `/shop/product/:id`

The cart and profile should redirect to buyer login if buyer is not logged in.

## Step 5 - Product Browsing For Buyers

Create a buyer-facing product listing page.

This page should show products from the existing product API.

Do not show admin actions to buyers:

- No add product button
- No update product button
- No delete product button

Buyer product cards should show:

- Product image or placeholder image
- Product name
- Category
- Price
- Short description
- View details button
- Add to cart button

Beginner checklist:

1. Reuse the product API already used by admin.
2. Display products in cards, not admin table layout.
3. Add search by product name.
4. Add category filter.
5. Add a product detail page.
6. Add an Add to Cart button.

## Step 6 - Buyer Product Detail Page

Create a page for one product.

The page should show:

- Product image
- Product name
- Category
- Price
- Full description
- Quantity selector
- Add to cart button

Do not include admin update or delete buttons.

## Step 7 - Cart UI

Create cart pages and components.

Cart should show:

- Product name
- Product image
- Price
- Quantity
- Item total
- Cart total
- Remove button
- Increase quantity button
- Decrease quantity button

Do not add checkout, order placement, or payment buttons in Phase 2.

Instead of checkout, show disabled or simple text like:

`Checkout will be added in Phase 3`

## Step 8 - Cart API Integration

Once backend APIs are ready, connect the cart UI.

Expected actions:

- Get current buyer cart
- Add product to cart
- Update item quantity
- Remove item from cart
- Clear cart

Beginner checklist:

1. Create cart API helper functions or context methods.
2. Send buyer token with cart API requests.
3. Refresh cart after add/update/remove.
4. Show loading state during API requests.
5. Show friendly error messages.

## Step 9 - Buyer Profile CRUD UI

Create a buyer profile page.

Profile should allow buyer to:

- View profile
- Update name
- Update phone
- Update address
- Delete account only if backend supports it

Do not include admin profile fields.

Beginner checklist:

1. Fetch buyer profile after login.
2. Show profile data in a form.
3. Add edit mode.
4. Send update request.
5. Show success or error message.
6. Test refresh after update.

## Step 10 - Navigation

Add buyer navigation without disturbing admin navigation.

Buyer navigation should include:

- Shop
- Cart
- Profile
- Login or Logout

Admin navigation should stay separate.

Do not put buyer cart links inside the admin sidebar.

## Step 11 - Empty And Error States

Add simple states for:

- No products found
- Cart is empty
- Buyer is not logged in
- API failed
- Loading data

These states help users understand what is happening.

## Step 12 - Testing Checklist

Before raising a pull request, test:

- Admin login still works.
- Admin product CRUD still works.
- Buyer registration works.
- Buyer login works.
- Buyer can see products.
- Buyer can open product details.
- Buyer can add product to cart.
- Buyer can increase and decrease quantity.
- Buyer can remove item from cart.
- Buyer cart survives page refresh if backend supports it.
- Buyer profile can be viewed and updated.
- Buyer cannot access admin dashboard.
- Admin cannot accidentally use buyer cart as admin.

## Files You May Create

Suggested files:

- `src/pages/buyerRegister.jsx`
- `src/pages/buyerLogin.jsx`
- `src/pages/shop.jsx`
- `src/pages/shopProductDetails.jsx`
- `src/pages/cart.jsx`
- `src/pages/buyerProfile.jsx`
- `src/context/buyerAuthContext.jsx`
- `src/context/cartContext.jsx`
- `src/route/buyerProtectedRoute.jsx`
- `src/component/buyerHeader.jsx`
- `src/component/productCard.jsx`
- `src/component/cartItem.jsx`

You do not need to use exactly these names, but keep names clear.

## Files To Be Careful With

Be careful when editing:

- `src/App.jsx`
- `src/api/axios.js`
- `src/context/productcontext.jsx`
- `src/route/protectedRoute.jsx`

These files affect existing admin functionality.

## Pull Request Checklist

Before pushing:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Test in the browser.
4. Write what pages you added.
5. Write what backend APIs your pages expect.
6. Mention anything waiting on backend.

## What Not To Build In Phase 2

Do not build:

- Order placement
- Payment gateway
- Invoice
- Admin order management
- Buyer order history
- Delivery tracking

These belong to Phase 3.
