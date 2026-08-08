# Shopster Phase 4 Frontend Guide - Payment Integration (August 2026)

## Executive Summary

Phase 4 is about **building the payment UI** that connects to the backend payment APIs built by the backend team.

**What you'll build:**
1. Payment method selection at checkout (Cash on Delivery OR Razorpay/Stripe)
2. Payment forms for Razorpay or Stripe
3. Payment success/failure handling
4. Invoice download for paid orders
5. Admin refund UI

**Complete user journey:**
1. Buyer adds items to cart
2. Clicks "Proceed to Checkout"
3. Selects payment method (COD or Card/UPI)
4. If card: opens payment form → enters card details → completes payment
5. Gets order confirmation with payment status
6. Can download invoice if paid
7. Admin can issue refunds from order detail page

**Timeline:** 2-3 weeks, coordinated with backend (Dev A finishes payment APIs first, then Dev B does invoices)

---

## Where We Are

**Phase 1:** Admin auth + admin product CRUD ✅  
**Phase 2:** Buyer auth + buyer profile + cart ✅  
**Phase 3:** Order placement (Cash on Delivery only) + order history + admin order management ✅  
**Phase 4:** Payment UI + invoices + admin refund UI (THIS PHASE)

All previous phases must continue to work. Do not break Phase 1/2/3 functionality.

---

## Goal Of Phase 4

Build a complete payment UI on top of Phase 3 orders:

**For Buyers:**
- Choose payment method at checkout (Cash on Delivery or card/UPI via Razorpay/Stripe)
- Complete payment securely via gateway
- See payment status on order confirmation
- Download invoices for paid orders
- See payment status in order history

**For Admins:**
- See payment status for all orders
- See payment method for each order
- Issue refunds with reason
- View refund status

**Technical Goals:**
- Integrate Razorpay Checkout or Stripe Payment Element
- Never handle card data directly (gateway SDKs handle it)
- Verify payment status from backend before confirming
- Handle payment failures gracefully
- Build responsive invoice download UI
- Build intuitive refund UI for admins

---

## CRITICAL: Never Handle Card Data Directly

**RULE:** Never accept card numbers, CVV, or expiry dates in your forms.

The payment gateway SDKs handle all card data securely. Your job is:
1. Get payment initiation details from backend
2. Open gateway's payment form
3. Let user complete payment
4. Verify payment on backend
5. Show confirmation

This keeps card data PCI-compliant (certified secure).

---

## Current Frontend Structure

```
frontend-shopster/
├── src/
│   ├── pages/
│   │   ├── buyers/
│   │   │   ├── checkout.jsx (modify - add payment method)
│   │   │   ├── order-confirmation.jsx (modify - show payment status)
│   │   │   ├── orders.jsx (modify - show payment status)
│   │   │   └── order-details.jsx (modify - add invoice download)
│   │   ├── admin/
│   │   │   ├── orderlisting.jsx (modify - show payment status)
│   │   │   └── orderdetails.jsx (modify - add refund form)
│   │   └── (other pages)
│   ├── components/
│   │   ├── buyers/
│   │   │   ├── paymentmethod-selector.jsx (NEW)
│   │   │   ├── razorpaycheckout.jsx (NEW - if Razorpay)
│   │   │   └── stripecheckout.jsx (NEW - if Stripe)
│   │   ├── admin/
│   │   │   └── refund-form.jsx (NEW)
│   │   └── (other components)
│   ├── utils/
│   │   ├── razorpayPayment.js (NEW - if Razorpay)
│   │   ├── stripePayment.js (NEW - if Stripe)
│   │   └── (other utils)
│   ├── context/
│   │   ├── CartContext.jsx (modify - refresh after order)
│   │   └── (other contexts)
│   ├── api/
│   │   ├── orders.js (modify - add payment endpoints)
│   │   └── (other API calls)
│   └── App.jsx (no new routes needed from Phase 3)
├── public/
│   └── index.html (modify - add payment SDK)
└── (config files)
```

**Existing routes (don't break these):**
- `/checkout` - buyer checkout page
- `/order-confirmation/:id` - confirmation after order
- `/buyers/orders` - buyer's order history
- `/buyers/orders/:id` - buyer's single order
- `/order` - admin order list
- `/order/:id` - admin order detail

All these routes already exist from Phase 3. You'll modify the content, not create new routes.

---

## Team Workflow

### Before You Start
1. Coordinate with backend team - wait for them to finish payment APIs
2. Pull latest code: `git pull origin main`
3. Create your branch: `git checkout -b feature/phase4-payments`
4. Run frontend: `npm start`
5. Verify Phase 1/2/3 still works

### Daily
```bash
# Every morning
git pull origin main

# After changes
git add .
git commit -m "feat: add payment method selector"

# Before PR
git pull origin main  # Get latest
# Resolve any conflicts
npm start             # Test again
```

---

## Step 1: Load Payment SDK in index.html

Edit `public/index.html`

Add payment SDK before the closing `</head>` tag:

### For Razorpay:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Shopster</title>
    
    <!-- Add this before closing head tag -->
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### For Stripe:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Shopster</title>
    
    <!-- Add this before closing head tag -->
    <script src="https://js.stripe.com/v3/"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

## Step 2: Create Payment Utility Functions

### For Razorpay:

Create file: `src/utils/razorpayPayment.js`

```javascript
// Razorpay payment utility
export const initiateRazorpayPayment = (order, razorpayOrderId, razorpayKeyId, onSuccess, onFailure) => {
  const options = {
    key: razorpayKeyId,  // Public key from backend
    order_id: razorpayOrderId,  // Razorpay order ID from backend
    handler: async (response) => {
      // Payment succeeded on Razorpay side
      // Now verify it on backend
      try {
        console.log('Payment completed:', response.razorpay_payment_id);
        
        // Call backend to verify payment
        const verifyResponse = await fetch(`/api/orders/${order._id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('buyerToken')}`
          }
        });
        
        const data = await verifyResponse.json();
        
        // Check if payment status is "Paid" on backend
        if (data.data.paymentStatus === 'Paid') {
          onSuccess(order._id);
        } else {
          onFailure('Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        onFailure('Payment verification error');
      }
    },
    prefill: {
      // Pre-fill buyer details
      email: order.buyer?.email || '',
      contact: order.buyer?.phone || ''
    },
    theme: {
      color: '#3399cc'  // Customize with your brand color
    },
    modal: {
      ondismiss: () => {
        onFailure('Payment cancelled by user');
      }
    }
  };
  
  // Open Razorpay checkout form
  const rzp = new window.Razorpay(options);
  rzp.open();
};

// Helper to get buyer token from localStorage
export const getBuyerToken = () => {
  return localStorage.getItem('buyerToken');
};

// Helper to get buyer info from localStorage
export const getBuyerInfo = () => {
  const buyerInfo = localStorage.getItem('buyerInfo');
  return buyerInfo ? JSON.parse(buyerInfo) : null;
};
```

### For Stripe:

Create file: `src/utils/stripePayment.js`

```javascript
import { loadStripe } from '@stripe/js';

let stripePromise = null;

// Get Stripe instance (singleton)
export const getStripe = async (publishableKey) => {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Initialize Stripe Elements
export const createStripeElements = async (publishableKey) => {
  const stripe = await getStripe(publishableKey);
  
  if (!stripe) {
    throw new Error('Failed to load Stripe');
  }
  
  const elements = stripe.elements();
  const paymentElement = elements.create('payment');
  
  return { stripe, elements, paymentElement };
};

// Confirm payment with Stripe
export const confirmStripePayment = async (stripe, elements, clientSecret, orderId) => {
  if (!stripe || !elements) {
    throw new Error('Stripe not loaded');
  }
  
  const { paymentIntent, error } = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: `${window.location.origin}/order-confirmation/${orderId}`
    }
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  if (paymentIntent.status === 'succeeded') {
    return { success: true, paymentIntent };
  }
  
  return { success: false, error: 'Payment was not completed' };
};
```

---

## Step 3: Create API Functions for Payments

Edit/Create `src/api/orders.js` (or similar):

```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get buyer auth token
const getBuyerToken = () => localStorage.getItem('buyerToken');

// ===== PAYMENT ENDPOINTS =====

// Initiate Razorpay payment for an order
export const initiateRazorpayPayment = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE}/payment/${orderId}/initiate-razorpay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getBuyerToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error('Razorpay initiation error:', err);
    return { success: false, error: 'Failed to initiate payment' };
  }
};

// Initiate Stripe payment for an order
export const initiateStripePayment = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE}/payment/${orderId}/initiate-stripe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getBuyerToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error('Stripe initiation error:', err);
    return { success: false, error: 'Failed to initiate payment' };
  }
};

// Download invoice for an order
export const downloadInvoice = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/invoice`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getBuyerToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Invoice download failed');
    }
    
    // Get filename from response headers
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `invoice_${orderId}.html`;
    
    // Get file blob
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (err) {
    console.error('Invoice download error:', err);
    return { success: false, error: 'Failed to download invoice' };
  }
};

// ===== ADMIN REFUND ENDPOINTS =====

// Get admin token
const getAdminToken = () => localStorage.getItem('adminToken');

// Issue a refund (admin only)
export const issueRefund = async (orderId, amount, reason) => {
  try {
    const response = await fetch(`${API_BASE}/admin/refund/${orderId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAdminToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, reason })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error('Refund error:', err);
    return { success: false, error: 'Failed to issue refund' };
  }
};

// List refunded orders (admin only)
export const listRefunds = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/refunds`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAdminToken()}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error('Refunds list error:', err);
    return { success: false, error: 'Failed to fetch refunds' };
  }
};
```

---

## Step 4: Create Payment Method Selector Component

Create file: `src/components/buyers/PaymentMethodSelector.jsx`

```javascript
import React, { useState } from 'react';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange, isLoading }) => {
  return (
    <div className="payment-method-selector">
      <h3>Select Payment Method</h3>
      
      <div className="payment-options">
        {/* Cash on Delivery */}
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={selectedMethod === 'COD'}
            onChange={(e) => onMethodChange(e.target.value)}
            disabled={isLoading}
          />
          <span className="option-label">
            <strong>Cash on Delivery (COD)</strong>
            <p className="option-description">Pay when your order arrives</p>
          </span>
        </label>
        
        {/* Razorpay */}
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="Razorpay"
            checked={selectedMethod === 'Razorpay'}
            onChange={(e) => onMethodChange(e.target.value)}
            disabled={isLoading}
          />
          <span className="option-label">
            <strong>Card / UPI (Razorpay)</strong>
            <p className="option-description">Pay securely with your card or UPI</p>
          </span>
        </label>
        
        {/* Stripe (if applicable) */}
        {/* 
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="Stripe"
            checked={selectedMethod === 'Stripe'}
            onChange={(e) => onMethodChange(e.target.value)}
            disabled={isLoading}
          />
          <span className="option-label">
            <strong>Card Payment (Stripe)</strong>
            <p className="option-description">Pay securely with your card</p>
          </span>
        </label>
        */}
      </div>
      
      <style jsx>{`
        .payment-method-selector {
          margin: 20px 0;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .payment-method-selector h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
        }
        
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .payment-option {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          background-color: white;
          border: 2px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .payment-option:hover {
          border-color: #007bff;
          background-color: #f0f7ff;
        }
        
        .payment-option input[type="radio"] {
          margin-right: 12px;
          margin-top: 2px;
          cursor: pointer;
          accent-color: #007bff;
        }
        
        .payment-option input[type="radio"]:checked + .option-label {
          color: #007bff;
        }
        
        .option-label {
          cursor: pointer;
          flex: 1;
        }
        
        .option-label strong {
          display: block;
          margin-bottom: 4px;
          font-size: 16px;
        }
        
        .option-description {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default PaymentMethodSelector;
```

---

## Step 5: Modify Checkout Page

Edit `src/pages/buyers/checkout.jsx`

The checkout page should:
1. Show cart items
2. Show shipping address
3. **Show payment method selector**
4. **Show payment form if card/UPI selected**
5. **Handle order placement**

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PaymentMethodSelector from '../../components/buyers/PaymentMethodSelector';
import RazorpayCheckout from '../../components/buyers/RazorpayCheckout';  // Create this
import { initiateRazorpayPayment, createOrder } from '../../api/orders';
import { initiateRazorpayPayment as initiatePayment } from '../../utils/razorpayPayment';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, refetchCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  
  // Check if cart is empty
  if (!cartLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart before checkout</p>
          <button onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  if (cartLoading) return <div>Loading checkout...</div>;
  
  const totalAmount = cart.items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );
  
  // Step 1: Place order (create order in database)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!shippingAddress.trim()) {
      setError('Please enter shipping address');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create order with selected payment method
      const createRes = await createOrder({
        shippingAddress,
        paymentMethod
      });
      
      if (!createRes.success) {
        setError(createRes.error || 'Failed to place order');
        setIsProcessing(false);
        return;
      }
      
      const newOrder = createRes.data;
      setOrder(newOrder);
      
      // If COD, go directly to confirmation
      if (paymentMethod === 'COD') {
        // Clear cart
        await refetchCart();
        navigate(`/order-confirmation/${newOrder._id}`);
      } else if (paymentMethod === 'Razorpay') {
        // Initiate Razorpay payment
        const paymentRes = await initiateRazorpayPayment(newOrder._id);
        
        if (!paymentRes.success) {
          setError(paymentRes.error || 'Failed to initiate payment');
          setIsProcessing(false);
          return;
        }
        
        const { razorpayOrderId, razorpayKeyId } = paymentRes.data;
        
        // Open Razorpay form
        initiatePayment(
          newOrder,
          razorpayOrderId,
          razorpayKeyId,
          // Success callback
          async (orderId) => {
            console.log('Payment successful');
            await refetchCart();  // Clear cart
            navigate(`/order-confirmation/${orderId}`);
          },
          // Failure callback
          (failureReason) => {
            console.log('Payment failed:', failureReason);
            setError(failureReason || 'Payment failed');
            setIsProcessing(false);
          }
        );
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred during checkout');
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          {cart.items.map(item => (
            <div key={item.product._id} className="cart-item">
              <span>{item.product.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
          </div>
        </div>
        
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder}>
          {/* Shipping Address */}
          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address"
              required
              disabled={isProcessing}
            />
          </div>
          
          {/* Payment Method Selector */}
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
            isLoading={isProcessing}
          />
          
          {/* Place Order Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="place-order-btn"
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
      
      <style jsx>{`
        .checkout-page {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
        }
        
        .checkout-container h1 {
          font-size: 28px;
          margin-bottom: 20px;
        }
        
        .error-message {
          padding: 12px;
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .cart-summary {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #ddd;
        }
        
        .cart-total {
          padding: 10px 0;
          font-size: 16px;
          text-align: right;
          margin-top: 10px;
          border-top: 2px solid #333;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        .form-group textarea {
          width: 100%;
          min-height: 100px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: Arial, sans-serif;
        }
        
        .place-order-btn {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          background-color: #007bff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
        }
        
        .place-order-btn:hover:not(:disabled) {
          background-color: #0056b3;
        }
        
        .place-order-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
```

---

## Step 6: Create Razorpay Checkout Component

Create file: `src/components/buyers/RazorpayCheckout.jsx`

```javascript
import React, { useEffect, useState } from 'react';

const RazorpayCheckout = ({ order, razorpayKeyId, razorpayOrderId, onSuccess, onFailure }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (!razorpayOrderId || !razorpayKeyId) return;
    
    // Auto-open payment form
    openPaymentForm();
  }, [razorpayOrderId, razorpayKeyId]);
  
  const openPaymentForm = () => {
    if (!window.Razorpay) {
      onFailure('Razorpay SDK not loaded');
      return;
    }
    
    const options = {
      key: razorpayKeyId,
      order_id: razorpayOrderId,
      handler: async (response) => {
        console.log('Payment completed:', response.razorpay_payment_id);
        onSuccess(response);
      },
      prefill: {
        email: order?.buyer?.email || '',
        contact: order?.buyer?.phone || ''
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: () => {
          onFailure('Payment cancelled by user');
        }
      }
    };
    
    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsOpen(true);
    } catch (err) {
      console.error('Razorpay error:', err);
      onFailure('Failed to open payment form');
    }
  };
  
  return (
    <div className="razorpay-checkout">
      {!isOpen && (
        <button type="button" onClick={openPaymentForm} className="retry-payment-btn">
          Open Payment Form
        </button>
      )}
      
      <style jsx>{`
        .razorpay-checkout {
          text-align: center;
          padding: 20px;
        }
        
        .retry-payment-btn {
          padding: 10px 20px;
          font-size: 14px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .retry-payment-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default RazorpayCheckout;
```

---

## Step 7: Update Order Confirmation Page

Edit `src/pages/buyers/order-confirmation.jsx`

```javascript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSingleOrder } from '../../api/orders';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchOrder();
  }, [orderId]);
  
  const fetchOrder = async () => {
    try {
      const res = await getSingleOrder(orderId);
      
      if (res.success) {
        setOrder(res.data);
      } else {
        setError(res.error || 'Failed to load order');
      }
    } catch (err) {
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading order...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div>Order not found</div>;
  
  const getPaymentStatusBadge = (status) => {
    const colors = {
      'Paid': '#d4edda',
      'Pending': '#fff3cd',
      'Failed': '#f8d7da',
      'NotInitiated': '#e7e7e7'
    };
    
    return (
      <span className="payment-status-badge" style={{ backgroundColor: colors[status] }}>
        {status}
      </span>
    );
  };
  
  return (
    <div className="order-confirmation">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        
        {order.paymentStatus === 'Paid' && (
          <div className="success-message">
            Your payment has been received successfully
          </div>
        )}
        
        {order.paymentStatus === 'Pending' && (
          <div className="pending-message">
            Awaiting payment completion
          </div>
        )}
        
        {/* Order Details */}
        <div className="order-details">
          <div className="detail-row">
            <span>Order ID:</span>
            <strong>{order._id}</strong>
          </div>
          
          <div className="detail-row">
            <span>Order Date:</span>
            <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
          </div>
          
          <div className="detail-row">
            <span>Payment Method:</span>
            <strong>{order.paymentMethod || 'COD'}</strong>
          </div>
          
          <div className="detail-row">
            <span>Payment Status:</span>
            {getPaymentStatusBadge(order.paymentStatus)}
          </div>
        </div>
        
        {/* Order Items */}
        <div className="order-items">
          <h3>Items Ordered</h3>
          {order.items && order.items.map(item => (
            <div key={item.product._id} className="item-row">
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="item-total">
            <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
          </div>
        </div>
        
        {/* Invoice Download (only if paid) */}
        {order.paymentStatus === 'Paid' && (
          <div className="invoice-section">
            <button
              onClick={() => downloadInvoice(order._id)}
              className="download-invoice-btn"
            >
              📄 Download Invoice
            </button>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate('/buyers/orders')}
            className="view-orders-btn"
          >
            View My Orders
          </button>
          
          <button
            onClick={() => navigate('/shop')}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .order-confirmation {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        }
        
        .confirmation-container {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
        }
        
        .success-icon {
          font-size: 48px;
          color: #28a745;
          margin-bottom: 20px;
        }
        
        .confirmation-container h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        .success-message {
          padding: 12px;
          background-color: #d4edda;
          color: #155724;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .pending-message {
          padding: 12px;
          background-color: #fff3cd;
          color: #856404;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .order-details {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          text-align: left;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        
        .payment-status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .order-items {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
        }
        
        .order-items h3 {
          margin-top: 0;
          text-align: left;
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          text-align: left;
        }
        
        .item-total {
          padding: 10px 0;
          border-top: 2px solid #333;
          text-align: right;
          margin-top: 10px;
        }
        
        .invoice-section {
          margin: 20px 0;
        }
        
        .download-invoice-btn {
          padding: 10px 20px;
          font-size: 14px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
        
        .download-invoice-btn:hover {
          background-color: #218838;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .view-orders-btn,
        .continue-shopping-btn {
          flex: 1;
          padding: 10px;
          font-size: 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .view-orders-btn {
          background-color: #007bff;
          color: white;
        }
        
        .view-orders-btn:hover {
          background-color: #0056b3;
        }
        
        .continue-shopping-btn {
          background-color: #6c757d;
          color: white;
        }
        
        .continue-shopping-btn:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
```

---

## Step 8: Update Order Detail Pages

Edit `src/pages/buyers/order-details.jsx`

Show payment status and add invoice download button:

```javascript
// Add to your existing order detail component:

{/* Payment Status Section */}
<div className="payment-section">
  <h3>Payment Information</h3>
  <div className="info-row">
    <span>Payment Method:</span>
    <strong>{order.paymentMethod || 'COD'}</strong>
  </div>
  <div className="info-row">
    <span>Payment Status:</span>
    <span className={`status-${order.paymentStatus.toLowerCase()}`}>
      {order.paymentStatus}
    </span>
  </div>
  
  {order.paymentTimestamp && (
    <div className="info-row">
      <span>Payment Date:</span>
      <strong>{new Date(order.paymentTimestamp).toLocaleDateString()}</strong>
    </div>
  )}
</div>

{/* Invoice Download Button */}
{order.paymentStatus === 'Paid' && (
  <button
    onClick={() => downloadInvoice(order._id)}
    className="download-invoice-btn"
  >
    📄 Download Invoice
  </button>
)}
```

---

## Step 9: Create Admin Refund Component

Create file: `src/components/admin/RefundForm.jsx`

```javascript
import React, { useState } from 'react';
import { issueRefund } from '../../api/orders';

const RefundForm = ({ order, onRefundSuccess }) => {
  const [refundAmount, setRefundAmount] = useState(order.totalAmount - (order.refundAmount || 0));
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const maxRefundable = order.totalAmount - (order.refundAmount || 0);
  
  // Can only refund paid orders
  if (order.paymentStatus !== 'Paid') {
    return (
      <div className="refund-unavailable">
        <p>Refunds can only be issued for paid orders.</p>
        <p>Current payment status: {order.paymentStatus}</p>
      </div>
    );
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!reason.trim()) {
      setError('Refund reason is required');
      return;
    }
    
    if (refundAmount <= 0 || refundAmount > maxRefundable) {
      setError(`Refund amount must be between ₹0 and ₹${maxRefundable}`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const res = await issueRefund(order._id, refundAmount, reason);
      
      if (res.success) {
        setMessage(`Refund of ₹${refundAmount} issued successfully`);
        setRefundAmount(0);
        setReason('');
        
        // Refresh parent component
        if (onRefundSuccess) {
          setTimeout(() => onRefundSuccess(), 2000);
        }
      } else {
        setError(res.error || 'Failed to issue refund');
      }
    } catch (err) {
      console.error('Refund error:', err);
      setError('An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="refund-form-container">
      <h3>Issue Refund</h3>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="refund-info">
        <div className="info-row">
          <span>Order Total:</span>
          <strong>₹{order.totalAmount.toFixed(2)}</strong>
        </div>
        <div className="info-row">
          <span>Already Refunded:</span>
          <strong>₹{(order.refundAmount || 0).toFixed(2)}</strong>
        </div>
        <div className="info-row">
          <span>Max Refundable:</span>
          <strong>₹{maxRefundable.toFixed(2)}</strong>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Refund Amount (₹)</label>
          <input
            type="number"
            value={refundAmount}
            onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
            min="0"
            max={maxRefundable}
            step="0.01"
            disabled={isProcessing}
            required
          />
          <small>Max: ₹{maxRefundable.toFixed(2)}</small>
        </div>
        
        <div className="form-group">
          <label>Reason for Refund</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for refund (e.g., Customer requested, Item damaged, etc.)"
            disabled={isProcessing}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isProcessing}
          className="submit-btn"
        >
          {isProcessing ? 'Processing...' : 'Issue Refund'}
        </button>
      </form>
      
      <style jsx>{`
        .refund-form-container {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .refund-form-container h3 {
          margin-top: 0;
        }
        
        .refund-unavailable {
          padding: 15px;
          background-color: #fff3cd;
          color: #856404;
          border-radius: 4px;
          margin-top: 20px;
        }
        
        .success-message {
          padding: 12px;
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .error-message {
          padding: 12px;
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .refund-info {
          background-color: white;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        
        .info-row:last-child {
          border-bottom: none;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        
        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }
        
        .form-group small {
          display: block;
          margin-top: 4px;
          color: #666;
        }
        
        .submit-btn {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          font-weight: bold;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .submit-btn:hover:not(:disabled) {
          background-color: #c82333;
        }
        
        .submit-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default RefundForm;
```

---

## Step 10: Update Admin Order Detail Page

Edit `src/pages/admin/orderdetails.jsx`

Add the refund form to admin order detail:

```javascript
import RefundForm from '../../components/admin/RefundForm';

// In your order detail component:

{/* Show payment status for admins */}
<div className="payment-details">
  <h3>Payment Details</h3>
  <div className="detail-row">
    <span>Payment Method:</span>
    <strong>{order.paymentMethod || 'COD'}</strong>
  </div>
  <div className="detail-row">
    <span>Payment Status:</span>
    <span className={`status-${order.paymentStatus.toLowerCase()}`}>
      {order.paymentStatus}
    </span>
  </div>
  {order.refundAmount > 0 && (
    <div className="detail-row">
      <span>Refunded Amount:</span>
      <strong>₹{order.refundAmount.toFixed(2)}</strong>
    </div>
  )}
</div>

{/* Show refund form */}
<RefundForm
  order={order}
  onRefundSuccess={() => {
    // Refresh order details
    fetchOrder();
  }}
/>
```

---

## Step 11: Update Order Listing Pages

Edit `src/pages/buyers/orders.jsx` and `src/pages/admin/orderlisting.jsx`

Add payment status column to tables:

```javascript
// In order table, add a column:

<th>Payment Status</th>

// In table rows:

<td>
  <span className={`payment-badge status-${order.paymentStatus.toLowerCase()}`}>
    {order.paymentStatus}
  </span>
</td>

// Add CSS for status badges:
<style jsx>{`
  .payment-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .status-paid {
    background-color: #d4edda;
    color: #155724;
  }
  
  .status-pending {
    background-color: #fff3cd;
    color: #856404;
  }
  
  .status-failed {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .status-notinitiated {
    background-color: #e7e7e7;
    color: #383d41;
  }
  
  .status-refunded {
    background-color: #d1ecf1;
    color: #0c5460;
  }
`}</style>
```

---

## Step 12: Test Complete Phase 4 Flow

**Test Checklist:**

### Buyer Flow:
- [ ] Can select payment method at checkout
- [ ] Can proceed with COD order
- [ ] Can complete Razorpay/Stripe payment
- [ ] Sees payment status on confirmation page
- [ ] Can download invoice for paid orders
- [ ] Cannot download invoice for COD orders
- [ ] Order appears in order history with payment status
- [ ] Cart clears after successful order

### Admin Flow:
- [ ] Can see payment method for each order
- [ ] Can see payment status for each order
- [ ] Can issue full refund on paid order
- [ ] Can issue partial refund
- [ ] Cannot refund unpaid orders
- [ ] Refund decreases refundable amount
- [ ] Can see refund status in order details

### Error Handling:
- [ ] Empty checkout shows error
- [ ] Payment cancellation handled gracefully
- [ ] Invalid refund amount shows error
- [ ] Network errors show friendly messages

---

## API Integration Summary

**Backend APIs to use:**

```javascript
// Payment initiation
POST /api/payment/:orderId/initiate-razorpay
POST /api/payment/:orderId/initiate-stripe

// Invoice
GET /api/orders/:orderId/invoice

// Refund
POST /api/admin/refund/:orderId

// Order details (modified for Phase 4)
GET /api/orders/:orderId  // Now includes paymentStatus, paymentMethod
GET /api/orders  // Now includes paymentStatus for each order
```

**Responses follow this format:**
```json
{
  "status": "Success",
  "message": "Description",
  "data": { /* payload */ }
}
```

---

## Common Issues & Solutions

### "Razorpay is not defined"
**Problem:** SDK not loaded  
**Solution:** Verify `<script>` tag in public/index.html

### "Cart doesn't clear after payment"
**Problem:** CartContext not refreshed  
**Solution:** Call `refetchCart()` after successful payment

### "Invoice shows 'not available'"
**Problem:** Order not marked as paid  
**Solution:** Check webhook is processing on backend

### "Refund button disabled"
**Problem:** Order not in paid status  
**Solution:** Verify backend marked order as paid

---

## Testing with Real Test Cards

### Razorpay Test Cards:
- Success: `4111111111111111`
- Failure: `4444333322221111`
- Expiry: Any future date
- CVV: Any 3 digits

### Stripe Test Cards:
- Success: `4242424242424242`
- Failure: `4000000000000002`
- Expiry: Any future date
- CVV: Any 3 digits

---

## Final Checklist Before PR

- [ ] All Phase 1/2/3 functionality works
- [ ] Payment method selection works
- [ ] Razorpay/Stripe payment completes
- [ ] Invoice downloads for paid orders
- [ ] Admin can refund orders
- [ ] Order history shows payment status
- [ ] All forms show loading states
- [ ] Error messages are user-friendly
- [ ] No API keys in frontend code
- [ ] No console errors
- [ ] Responsive design works
- [ ] Git history is clean

---

**Timeline:** 2-3 weeks coordinated with backend  
**Team:** 1 frontend developer  
**Success metric:** Complete payment flow working end-to-end with real test transactions

Good luck! 🚀
