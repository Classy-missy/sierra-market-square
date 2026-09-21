import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Store, Package, CheckCircle, Clock, HelpCircle, ShoppingBag, Image, Tag } from "lucide-react";

const FAQItem = ({ question, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-[#E8E2D5] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-heading text-base font-bold text-[#1A1612] pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#00A0E3] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-[#1A1612]/70 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function VendorFAQ() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Hero */}
      <div className="bg-[#0D1B2A] text-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00A0E3]/20 mb-4">
            <HelpCircle className="w-8 h-8 text-[#00A0E3]" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
            Vendor <span className="text-[#00A0E3]">FAQ</span>
          </h1>
          <p className="text-sm text-[#F9F7F2]/70 max-w-xl mx-auto">
            Everything you need to know about listing your products and getting approved to sell on Sierra Leone Market Square.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Quick Steps */}
        <div className="mb-10">
          <h2 className="font-heading text-xl font-bold text-[#1A1612] mb-5 text-center">How It Works — In 4 Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E8E2D5] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-[#00A0E3]/10 flex items-center justify-center font-heading font-bold text-[#00A0E3]">1</div>
                <Store className="w-5 h-5 text-[#1A1612]/40" />
              </div>
              <h3 className="font-heading font-bold text-[#1A1612] mb-1">Register Your Business</h3>
              <p className="text-xs text-[#1A1612]/60">Create a vendor account with your business name, type, and contact details.</p>
            </div>
            <div className="bg-white border border-[#E8E2D5] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-[#00A0E3]/10 flex items-center justify-center font-heading font-bold text-[#00A0E3]">2</div>
                <Clock className="w-5 h-5 text-[#1A1612]/40" />
              </div>
              <h3 className="font-heading font-bold text-[#1A1612] mb-1">Wait for Approval</h3>
              <p className="text-xs text-[#1A1612]/60">Our admin team reviews your profile. You'll get access once approved.</p>
            </div>
            <div className="bg-white border border-[#E8E2D5] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-[#00A0E3]/10 flex items-center justify-center font-heading font-bold text-[#00A0E3]">3</div>
                <Package className="w-5 h-5 text-[#1A1612]/40" />
              </div>
              <h3 className="font-heading font-bold text-[#1A1612] mb-1">List Your Products</h3>
              <p className="text-xs text-[#1A1612]/60">Add products with photos, prices, and descriptions from your dashboard.</p>
            </div>
            <div className="bg-white border border-[#E8E2D5] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-[#00A0E3]/10 flex items-center justify-center font-heading font-bold text-[#00A0E3]">4</div>
                <ShoppingBag className="w-5 h-5 text-[#1A1612]/40" />
              </div>
              <h3 className="font-heading font-bold text-[#1A1612] mb-1">Reach Customers</h3>
              <p className="text-xs text-[#1A1612]/60">Your products appear in the marketplace for customers to browse and buy.</p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-[#1A1612] mb-4">Frequently Asked Questions</h2>

          <FAQItem
            defaultOpen
            question="How do I register as a vendor?"
            answer={
              <div className="space-y-2">
                <p>Click the <strong>Register</strong> dropdown in the top navigation and select <strong>Join as Vendor</strong>. Fill in your business name, business type (SME, SOHO, MICRO, or MACRO), sector, region, and contact information.</p>
                <p>You'll need a valid email address and password to create your account. After registering, you'll receive a verification code to confirm your email.</p>
              </div>
            }
          />

          <FAQItem
            question="How long does admin approval take?"
            answer={
              <div className="space-y-2">
                <p>Our admin team typically reviews new vendor profiles within <strong>1–2 business days</strong>. You'll see a "Pending Admin Approval" screen when you log into your Vendor Dashboard until your profile is approved.</p>
                <p>Once approved, you'll have full access to list products and manage your storefront.</p>
              </div>
            }
          />

          <FAQItem
            question="Why was my vendor profile not approved?"
            answer={
              <div className="space-y-2">
                <p>Common reasons a profile may be rejected or delayed include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Missing or unclear business description</li>
                  <li>No contact information (phone or email)</li>
                  <li>Business name that doesn't clearly identify your business</li>
                  <li>Incomplete business type or sector selection</li>
                </ul>
                <p>Make sure your profile is complete and accurate. You can edit your profile from the Vendor Dashboard at any time.</p>
              </div>
            }
          />

          <FAQItem
            question="How do I list my first product?"
            answer={
              <div className="space-y-2">
                <p>Once your vendor profile is approved:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Go to your <strong>Vendor Dashboard</strong></li>
                  <li>Click the <strong>Add Product</strong> button in the "My Products" section</li>
                  <li>Fill in the product name, category, price, stock quantity, and unit (e.g. "per bag", "per kg")</li>
                  <li>Add a clear product photo and a short description</li>
                  <li>Click <strong>Add Product</strong> to publish it to the marketplace</li>
                </ol>
              </div>
            }
          />

          <FAQItem
            question="What product categories can I choose from?"
            answer={
              <p>We support a wide range of categories including <strong>Tubers, Vegetables, Grains, Fruits, Spices, Oils, Beverages, Snacks, Baked Goods, Clothing, Footwear, Accessories, Textiles, Cosmetics, Soaps &amp; Skincare, Herbal Products, Jewelry, Beadwork, Baskets, Pottery, Woodwork,</strong> and <strong>Services</strong>. Pick the one that best fits your product.</p>
            }
          />

          <FAQItem
            question="What makes a good product listing?"
            answer={
              <div className="space-y-2">
                <p>To attract more customers:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Photo:</strong> Use a clear, well-lit image of your actual product</li>
                  <li><strong>Price:</strong> Set a fair, competitive price in NLe (Sierra Leonean Leone)</li>
                  <li><strong>Description:</strong> Write a short, honest description of what you're selling</li>
                  <li><strong>Stock:</strong> Keep your stock quantity updated so customers know what's available</li>
                  <li><strong>Unit:</strong> Clearly state how the product is sold (e.g. "per bag", "per dozen")</li>
                </ul>
              </div>
            }
          />

          <FAQItem
            question="Do I need to get each product approved by an admin?"
            answer={
              <p>No — once your <strong>vendor profile</strong> is approved by the admin team, you can list and edit products freely from your dashboard without further approval. However, admins may review or remove listings that don't meet community guidelines.</p>
            }
          />

          <FAQItem
            question="How do I edit my product price or stock?"
            answer={
              <p>In your Vendor Dashboard, find the product in the "My Products" table and click <strong>Edit Stock/Price</strong>. Update the values and click <strong>Save</strong>. Your changes take effect immediately in the marketplace.</p>
            }
          />

          <FAQItem
            question="Can I edit my business profile after registering?"
            answer={
              <p>Yes. Go to your Vendor Dashboard and click <strong>Edit Profile</strong> in the Business Profile section. You can update your business description, image, location, phone, email, website, and WhatsApp number at any time.</p>
            }
          />

          <FAQItem
            question="How do customers find my products?"
            answer={
              <p>Your products automatically appear on the <strong>Home</strong> page marketplace grid, where customers can browse, search, and filter by category, sector, and region. Customers can also visit your storefront directly from the <strong>Vendors</strong> page to see all your products in one place.</p>
            }
          />

          <FAQItem
            question="Can I track how many people view my products?"
            answer={
              <p>Yes. Your Vendor Dashboard includes an <strong>Analytics</strong> section showing how many customers have viewed your products and a summary of your recent sales. Use these insights to understand which products are most popular.</p>
            }
          />

          <FAQItem
            question="How do I record a sale?"
            answer={
              <p>In the Analytics section of your Vendor Dashboard, use the <strong>Record a Sale</strong> form to log each sale. Select the product, enter the quantity sold and the customer's name, and the total is calculated automatically. This helps you track your revenue over time.</p>
            }
          />

          <FAQItem
            question="What if I need help or have more questions?"
            answer={
              <div className="space-y-2">
                <p>If you need assistance, you can:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Visit the <strong>About</strong> page to learn more about the platform</li>
                  <li>Check the <strong>Mentors</strong> page to connect with experienced business mentors</li>
                  <li>Read our <strong>Blog</strong> for vendor success stories and tips</li>
                </ul>
              </div>
            }
          />
        </div>

        {/* CTA */}
        <div className="mt-10 bg-[#00A0E3]/5 border border-[#00A0E3]/20 rounded-lg p-6 text-center">
          <CheckCircle className="w-10 h-10 text-[#00A0E3] mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-2">Ready to Start Selling?</h3>
          <p className="text-sm text-[#1A1612]/60 mb-5">Register your business today and join a community of women entrepreneurs.</p>
          <Link
            to="/register-vendor"
            className="inline-flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-6 py-3 rounded-md font-medium hover:bg-[#0086C0] transition-colors"
          >
            <Store className="w-4 h-4" /> Register as Vendor
          </Link>
        </div>
      </div>
    </div>
  );
}