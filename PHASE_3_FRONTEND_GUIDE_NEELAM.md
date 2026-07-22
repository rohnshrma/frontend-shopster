# Shopster Phase 3 Frontend Guide - Neelam

## Where We Are

Phase 1 gave us admin login, admin registration, and admin product CRUD.

Phase 2 gave us buyer registration, buyer login, buyer profile CRUD, buyer product browsing, and buyer cart. The cart page currently shows the placeholder text "Checkout will be added in Phase 3" instead of a real checkout button.

Both phases are done and tested. Do not break them.

## Goal Of Phase 3

Phase 3 replaces that placeholder with a real (but simple) checkout, and adds order-related pages for both buyer and admin:

- Buyer checkout page (Cash on Delivery only)
- Order confirmation page
- Buyer order history and order detail pages
- Admin order list, order detail, and status-update UI

The admin sidebar already has an "Order" nav item showing dummy numbers on the dashboard — Phase 3 is what makes that real.

Payments and invoices are Phase 4. Do not add a payment form, card fields, or any gateway SDK in Phase 3 — checkout should only offer Cash on Delivery.

## Your Branch

Work only on your own frontend branch.

Before starting work:

1. Pull the latest project code.
2. Switch to your branch.
3. Run the frontend locally.
4. Make sure Phase 1 and Phase 2 still work before adding Phase 3.

Do not edit backend files from the frontend branch.

## Important Rule

Do not duplicate the admin order table styling from scratch if something similar already exists (check `productlisting.jsx` for the admin table pattern). Reuse layout patterns instead of reinventing them.

Buyer and admin order views are different:

- Buyer sees only their own orders.
- Admin sees every order and can change its status.

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

The backend team will create order APIs. Ask Vikram and Jeet for the final routes before connecting the UI.

Expected route groups may look like:

- `POST /api/orders` — place an order from the buyer's cart
- `GET /api/orders` — buyer's own order history
- `GET /api/orders/:id` — one order's detail (buyer-owned)
- `GET /api/admin/orders` — admin: all orders
- `GET /api/admin/orders/:id` — admin: one order
- `PUT /api/admin/orders/:id/status` — admin: update status

Do not hardcode fake order data permanently. Temporary data is okay only while waiting for the backend APIs.

## Step 1 - Create Order Routes

Add frontend routes for order pages.

Suggested buyer-facing pages:

- `/checkout`
- `/order-confirmation/:id`
- `/buyers/orders`
- `/buyers/orders/:id`

Suggested admin-facing pages:

- `/order` (list — the sidebar link already points here)
- `/order/:id` (detail + status update)

Keep every existing Phase 1/2 route working. Do not break:

- `/login`, `/register`, `/`, `/products`, `/addproduct`, `/updateproduct/:id`
- `/buyers/login`, `/buyers/register`, `/shop`, `/shop/productdetails/:id`, `/cart`, `/buyers/profile`, `/buyers/profile/edit`

## Step 2 - Replace The Checkout Placeholder

In the cart page/component, replace the "Checkout will be added in Phase 3" text with a "Proceed to Checkout" button that links to `/checkout`. Only show it when the cart has items.

## Step 3 - Buyer Checkout Page

Route: `/checkout` (buyer protected — redirect to buyer login if not logged in).

The page should show:

- A summary of cart items (name, quantity, price, item total)
- Cart total
- Shipping address (start with the buyer's profile address; a simple editable text field is fine)
- Payment method — show "Cash on Delivery" as the only option. If you want to show a hint about the future, a disabled option or note like "Card and UPI payments coming in Phase 4" is fine, but do not build a real payment form.
- A "Place Order" button

Beginner checklist:

1. Fetch cart items using the existing cart context (do not duplicate cart-fetching logic).
2. Block checkout with a clear message if the cart is empty.
3. Call the place-order API on submit.
4. Show a loading state while the order is being placed.
5. Show a friendly error message if the order fails (e.g. cart became empty, network error).

## Step 4 - Order Placement Integration

On successful order placement:

1. The cart is cleared server-side by the backend — refresh the cart context so the UI reflects an empty cart.
2. Redirect to `/order-confirmation/:id` using the id returned by the API.

## Step 5 - Order Confirmation Page

Route: `/order-confirmation/:id` (buyer protected).

Show:

- Order id
- Ordered items and quantities
- Total amount
- Payment method (Cash on Delivery)
- Current status (will be "Pending")
- A link to "View My Orders" and a link back to `/shop`

## Step 6 - Buyer Order History

Route: `/buyers/orders` (buyer protected).

List each past order with: order id, date, total, status, and a "View" link to `/buyers/orders/:id`.

Route: `/buyers/orders/:id` (buyer protected) — same detail layout as the confirmation page, but for any past order. If the order isn't the logged-in buyer's (backend will reject it), show a friendly "order not found" message rather than a raw error.

## Step 7 - Buyer Navigation

Add a "My Orders" link to the buyer header/profile navigation, next to Profile and Cart. Do not touch admin navigation.

## Step 8 - Admin Order Management UI

Route: `/order` (admin protected) — this nav link already exists in the sidebar pointing at dummy dashboard numbers; wire it to the real admin orders list API instead.

Show a table with: buyer name/email, order date, total, status, and a "View" button — follow the existing admin table pattern used for products.

Route: `/order/:id` (admin protected) — order detail with buyer info, items, shipping address, and a status dropdown + "Update Status" button. After updating, refresh the order so the new status is visible immediately.

Do not add order-placement UI to the admin side — admins manage orders, they don't place them.

## Step 9 - Empty, Loading, And Error States

Add simple states for:

- Cart is empty (already exists) → checkout should also handle this
- No orders yet (buyer order history)
- No orders yet (admin order list)
- Order not found
- Checkout/order-placement failed
- Loading orders

## Step 10 - Testing Checklist

Before raising a pull request, test:

- Admin login, admin product CRUD still work.
- Buyer registration, login, shop browsing, cart CRUD, profile CRUD still work.
- Buyer can check out a non-empty cart and lands on the order confirmation page.
- Checkout is blocked with a clear message when the cart is empty.
- Cart is empty after a successful order.
- Buyer sees the new order in their order history.
- Buyer cannot view another buyer's order (try guessing an id — should show "not found", not someone else's data).
- Admin sees all orders from all buyers.
- Admin can update an order's status and the buyer's order detail reflects it on refresh.
- Buyer cannot access `/order` or `/order/:id` (admin routes).
- Admin token never authenticates a buyer route and vice versa (same as Phase 2).

## Files You May Create

Suggested files:

- `src/pages/buyers/checkout.jsx`
- `src/pages/buyers/order-confirmation.jsx`
- `src/pages/buyers/orders.jsx`
- `src/pages/buyers/order-details.jsx`
- `src/pages/orderlisting.jsx` (admin)
- `src/pages/orderdetails.jsx` (admin)
- `src/context/orderContext.jsx` (if you want an order context similar to the cart/product ones)

You do not need to use exactly these names, but keep names clear and consistent with existing files (e.g. `peoductdetails.jsx` is admin, `product-details.jsx` is buyer — follow whichever naming pattern the surrounding folder already uses).

## Files To Be Careful With

Be careful when editing:

- `src/App.jsx` (new routes)
- `src/pages/buyers/cart.jsx` / `src/component/buyers/cartitems.jsx` (removing the Phase 3 placeholder text)
- `src/context/CartContext.jsx` (refreshing the cart after an order clears it)
- `src/component/buyers/buyer-header.jsx` (adding the "My Orders" link)

These files affect existing Phase 1/2 functionality.

## What Not To Build In Phase 3

Do not build:

- A real payment form or any payment gateway SDK integration
- Invoice or receipt download
- Refund UI
- Delivery/shipment tracking UI
- Product reviews or ratings
- Wishlist
- Coupon code input
- Real charts/analytics on the admin dashboard

These are Phase 4 or Phase 5, described briefly below.

## Coming In Phase 4 (Preview Only — Not Built In Phase 3)

Phase 4 adds a real payment step on top of the checkout built in Phase 3:

- A Razorpay/Stripe checkout step (test mode) replacing the "Cash on Delivery only" note
- Payment success/failure handling in the UI
- Invoice/receipt download from the order detail page
- Refund status shown on an order, if the backend supports it

## Coming In Phase 5 (Preview Only — Not Built In Phase 3 Or 4)

Phase 5 is polish and post-purchase experience:

- An order status timeline/tracking view
- Product reviews and ratings on the product detail page
- Wishlist
- Coupon code input at checkout
- Real charts/analytics replacing today's placeholder admin dashboard numbers

## Pull Request Checklist

Before pushing:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Test in the browser.
4. Write what pages you added.
5. Write what backend APIs your pages expect.
6. Mention anything waiting on backend.
