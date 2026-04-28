'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send form data to backend
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-primary-100">We're here to help and answer any question you might have</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          {[
            {
              icon: <FiMail size={32} />,
              title: 'Email',
              content: 'support@farmdirect.in',
              description: 'We typically respond within 24 hours',
            },
            {
              icon: <FiPhone size={32} />,
              title: 'Phone',
              content: '1800-FARM-123',
              description: 'Available Mon-Sat, 9AM-6PM IST',
            },
            {
              icon: <FiMapPin size={32} />,
              title: 'Address',
              content: 'Bangalore, India',
              description: 'Head Office & Customer Support',
            },
          ].map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center"
            >
              <div className="text-primary-600 mx-auto mb-4 flex justify-center">{contact.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
              <p className="text-lg font-medium text-gray-900 mb-2">{contact.content}</p>
              <p className="text-gray-600 text-sm">{contact.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded text-center"
              >
                <div className="text-3xl mb-2">✅</div>
                <p className="font-bold">Thank you for your message!</p>
                <p>We'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="farmer">Farmer Registration</option>
                  <option value="buyer">Buyer Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership</option>
                </select>

                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="input-field resize-none"
                  required
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold transition"
                >
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiClock size={28} className="text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-bold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-bold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-bold">Closed</span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-900 hover:text-primary-600">
                    How do I register as a farmer?
                  </summary>
                  <p className="text-gray-600 mt-2">
                    Click on "Register" and select the "Farmer" option. Fill in your details and you're
                    ready to start listing products.
                  </p>
                </details>

                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-900 hover:text-primary-600">
                    What are the transaction fees?
                  </summary>
                  <p className="text-gray-600 mt-2">
                    FarmDirect charges a 5% commission on successful transactions. This helps us maintain
                    the platform.
                  </p>
                </details>

                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-900 hover:text-primary-600">
                    How is payment processed?
                  </summary>
                  <p className="text-gray-600 mt-2">
                    We support UPI, Credit/Debit Cards, and Cash on Delivery. All transactions are secure
                    and encrypted.
                  </p>
                </details>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="mb-4">Subscribe to our newsletter for updates and special offers.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded text-gray-900"
                />
                <button className="px-6 py-2 bg-accent-500 hover:bg-accent-600 font-bold rounded transition">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
