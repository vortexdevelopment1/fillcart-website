/**
 * faqData.js
 * Single source of truth for FillCarts FAQ / Help Centre.
 * All text is hardcoded here; components only read from this configuration.
 */

export const faqCategories = [
  {
    id: "orders",
    label: "Orders",
    subtitle: "Placing, tracking and cancelling orders",
    icon: "bag",
    items: [
      {
        id: "orders-1",
        q: "How do I track my active order?",
        a: "Go to “My Orders” in your profile and tap “Track order”. You will see the live rider movement on a map, with an updated delivery time."
      },
      // TEMP DEFAULT
      {
        id: "orders-2",
        q: "Can I cancel an order after placing it?",
        a: "You can cancel your order free of charge within [x] minutes of checkout before the merchant store begins packing. [Cancellation policy details to be confirmed.]"
      },
      // TEMP DEFAULT
      {
        id: "orders-3",
        q: "What should I do if my order is delayed?",
        a: "If your delivery partner is delayed by adverse weather or peak traffic, check the live map for updated ETA or tap 'Live chat' to reach support within [x] minutes."
      },
      // TEMP DEFAULT
      {
        id: "orders-4",
        q: "Can I change my delivery address after placing an order?",
        a: "Address adjustments are permitted within [x] minutes of placing an order if your rider has not yet been dispatched. [Address modification rules to be updated.]"
      }
    ]
  },
  {
    id: "payments",
    label: "Payments & Refunds",
    subtitle: "Payment methods, refunds and offers",
    icon: "wallet",
    items: [
      // TEMP DEFAULT
      {
        id: "payments-1",
        q: "How can I pay for my order?",
        a: "We accept UPI, Credit and Debit cards, Net Banking, and Cash on Delivery. [Payment methods to be added.]"
      },
      // TEMP DEFAULT
      {
        id: "payments-2",
        q: "My payment failed but the money was deducted. What now?",
        a: "Bank deductions for unsuccessful transactions are automatically reversed by your issuing bank within [24-48] hours. [Bank resolution guidelines to be confirmed.]"
      },
      // TEMP DEFAULT
      {
        id: "payments-3",
        q: "When will I get my refund?",
        a: "Refunds for cancelled or returned orders are credited back to your original payment method within [3-5] business days. [Refund processing SLA to be confirmed.]"
      },
      // TEMP DEFAULT
      {
        id: "payments-4",
        q: "How do I apply a coupon or offer?",
        a: "Enter your coupon code in the 'Apply Coupon' box on the cart summary screen before proceeding to checkout. [Discount terms and coupon rules to be verified.]"
      }
    ]
  },
  {
    id: "returns",
    label: "Returns",
    subtitle: "Wrong, damaged or missing items",
    icon: "refresh",
    items: [
      // TEMP DEFAULT
      {
        id: "returns-1",
        q: "What if an item is missing or damaged?",
        a: "Report missing or damaged items directly in 'My Orders' with a photo within [x] hours to receive an immediate replacement or refund. [Claim policy to be confirmed.]"
      },
      // TEMP DEFAULT
      {
        id: "returns-2",
        q: "How do I request a return or replacement?",
        a: "Select the delivered order from your profile, tap 'Return / Replacement', specify the reason, and a pickup will be arranged within [24] hours."
      },
      // TEMP DEFAULT
      {
        id: "returns-3",
        q: "Which items cannot be returned?",
        a: "Perishable foods, dairy products, and personal hygiene items cannot be returned once opened, unless delivered spoiled. [Non-returnable list to be finalized.]"
      },
      // TEMP DEFAULT
      {
        id: "returns-4",
        q: "How long do I have to report a problem?",
        a: "You have [24] hours from delivery to report any discrepancies with fresh produce, and [48] hours for packaged goods. [Time limits to be reviewed.]"
      }
    ]
  },
  {
    id: "delivery",
    label: "Delivery",
    subtitle: "Delivery areas, charges and timing",
    icon: "truck",
    items: [
      // TEMP DEFAULT
      {
        id: "delivery-1",
        q: "Which areas do you deliver to?",
        a: "We currently deliver across select urban neighbourhoods in [city]. [Complete delivery area list and pin codes to be added.]"
      },
      // TEMP DEFAULT
      {
        id: "delivery-2",
        q: "Is there a delivery charge?",
        a: "Orders above [₹299] receive free express delivery, while smaller orders incur a flat fee of [₹25]. [Delivery pricing structure to be confirmed.]"
      },
      // TEMP DEFAULT
      {
        id: "delivery-3",
        q: "How is the delivery time calculated?",
        a: "Delivery estimates are calculated in real time based on distance from the store, preparation time, and road conditions. [ETA algorithm note to be reviewed.]"
      },
      // TEMP DEFAULT
      {
        id: "delivery-4",
        q: "Can I schedule a delivery for later?",
        a: "A delivery slot and repeat delivery can be scheduled directly on the product detail page, or you can choose your preferred time window at checkout. [policy to be confirmed]"
      }
    ]
  },
  {
    id: "account",
    label: "Account",
    subtitle: "Your profile and addresses",
    icon: "user",
    items: [
      // TEMP DEFAULT
      {
        id: "account-1",
        q: "How do I create or delete my account?",
        a: "Create an account in seconds with your phone number and OTP. To delete your account and personal data, go to Profile Settings or contact support. [Data retention policy placeholder.]"
      },
      // TEMP DEFAULT
      {
        id: "account-2",
        q: "How do I update my phone number or email?",
        a: "Navigate to Profile > Edit Account to update your phone number, email address, or name with OTP verification. [Account modification terms to be confirmed.]"
      },
      // TEMP DEFAULT
      {
        id: "account-3",
        q: "How do I save more than one address?",
        a: "You can save multiple delivery locations (Home, Work, Other) in the Saved Addresses section of your profile for 1-tap checkout."
      }
    ]
  }
];

export const supportContact = {
  chatLabel: "24/7 Desk",
  phone: "1800-123-456",
  email: "support@fillcarts.com"
};
