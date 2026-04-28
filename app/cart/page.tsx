'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/authStore';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface CartItem {
  product: any;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export default function CartPage() {
  const router = useRouter();
  const { token, isLoggedIn, user } = useAuthStore();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'shipping' | 'payment'>('review');
  const [shippingData, setShippingData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await axios.delete(`/api/cart?productId=${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      if (checkoutStep === 'review') {
        setCheckoutStep('shipping');
        return;
      }

      if (checkoutStep === 'shipping') {
        if (!shippingData.city || !shippingData.state || !shippingData.zipCode) {
          alert('Please fill in all shipping details');
          return;
        }
        setCheckoutStep('payment');
        return;
      }

      // Final checkout
      if (!cart || cart.items.length === 0) {
        alert('Cart is empty');
        return;
      }

      const response = await axios.post(
        '/api/orders/create',
        {
          items: cart.items.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          paymentMethod,
          deliveryAddress: shippingData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert('Order placed successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error during checkout');
    }
  };

  if (loading) {
    return <div className="container-custom py-12 text-center">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link
          href="/marketplace"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
          >
            {/* Checkout Steps */}
            <div className="flex gap-4 mb-8">
              {['review', 'shipping', 'payment'].map((step) => (
                <div key={step} className="flex-1">
                  <div
                    className={`h-2 rounded-full ${
                      checkoutStep === step || step === 'review'
                        ? 'bg-primary-600'
                        : 'bg-gray-300'
                    }`}
                  />
                  <p className="text-sm capitalize mt-2 text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            {/* Review Step */}
            {checkoutStep === 'review' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Review Items</h2>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-4 border-b pb-4"
                    >
                      <img
                        src={item.product.images[0] || 'https://via.placeholder.com/100'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm">By {item.product.farmerDetails?.name}</p>
                        <p className="text-primary-600 font-bold mt-2">₹{item.price} × {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Shipping Step */}
            {checkoutStep === 'shipping' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={shippingData.street}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, street: e.target.value })
                    }
                    className="input-field"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingData.city}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, city: e.target.value })
                      }
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingData.state}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, state: e.target.value })
                      }
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={shippingData.zipCode}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, zipCode: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Payment Step */}
            {checkoutStep === 'payment' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'upi', label: '💳 UPI', description: 'Google Pay, PhonePe, etc.' },
                    { value: 'card', label: '💳 Credit/Debit Card', description: 'Visa, MasterCard' },
                    { value: 'cod', label: '📦 Cash on Delivery', description: 'Pay when order arrives' },
                  ].map((method) => (
                    <label key={method.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-primary-50">
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="ml-4">
                        <p className="font-bold text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24"
          >
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 border-b pb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">₹{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-bold text-primary-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (0%)</span>
                <span className="font-bold">₹0</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-bold text-primary-600">₹{cart.totalPrice}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold transition"
            >
              {checkoutStep === 'review'
                ? 'Continue to Shipping'
                : checkoutStep === 'shipping'
                ? 'Continue to Payment'
                : 'Place Order'}
            </motion.button>

            {checkoutStep !== 'review' && (
              <button
                onClick={() => {
                  if (checkoutStep === 'payment') {
                    setCheckoutStep('shipping');
                  } else {
                    setCheckoutStep('review');
                  }
                }}
                className="w-full mt-2 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-bold"
              >
                Back
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
