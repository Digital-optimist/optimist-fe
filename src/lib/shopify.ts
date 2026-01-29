// Shopify Storefront API Client and GraphQL Operations

const domain = "octolife-3.myshopify.com";
const storefrontAccessToken = "3b12d6020365806434052cc061a5b5e3";
const apiVersion = "2025-01";

// =============================================================================
// Types
// =============================================================================

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: ShopifyImage | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: {
    edges: { node: ShopifyImage }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: {
    edges: { node: ProductVariant }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  tags: string[];
  vendor: string;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
    selectedOptions: {
      name: string;
      value: string;
    }[];
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount: {
      amount: string;
      currencyCode: string;
    } | null;
  };
  lines: {
    edges: { node: CartLine }[];
  };
}

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  acceptsMarketing: boolean;
  defaultAddress: Address | null;
  addresses: {
    edges: { node: Address }[];
  };
  orders: {
    edges: { node: Order }[];
  };
}

export interface Address {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  provinceCode: string | null;
  country: string | null;
  countryCodeV2: string | null;
  zip: string | null;
  phone: string | null;
}

export interface Order {
  id: string;
  orderNumber: number;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: {
          image: ShopifyImage | null;
          price: {
            amount: string;
            currencyCode: string;
          };
        } | null;
      };
    }[];
  };
  shippingAddress: Address | null;
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

// =============================================================================
// GraphQL Client
// =============================================================================

async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "Unknown Shopify API error");
  }

  return json.data;
}

// =============================================================================
// GraphQL Fragments
// =============================================================================

const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`;

const PRODUCT_VARIANT_FRAGMENT = `
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    image {
      ...ImageFragment
    }
  }
`;

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    featuredImage {
      ...ImageFragment
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 100) {
      edges {
        node {
          ...ProductVariantFragment
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    tags
    vendor
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                handle
                title
                featuredImage {
                  ...ImageFragment
                }
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;

const ADDRESS_FRAGMENT = `
  fragment AddressFragment on MailingAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    city
    province
    provinceCode
    country
    countryCodeV2
    zip
    phone
  }
`;

const CUSTOMER_FRAGMENT = `
  fragment CustomerFragment on Customer {
    id
    firstName
    lastName
    email
    phone
    acceptsMarketing
    defaultAddress {
      ...AddressFragment
    }
    addresses(first: 10) {
      edges {
        node {
          ...AddressFragment
        }
      }
    }
    orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          id
          orderNumber
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  image {
                    ...ImageFragment
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          shippingAddress {
            ...AddressFragment
          }
        }
      }
    }
  }
`;

// =============================================================================
// Product Operations
// =============================================================================

export async function getProducts(first: number = 20): Promise<Product[]> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: { node: Product }[] } }>(
    {
      query,
      variables: { first },
    }
  );

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
  `;

  const data = await shopifyFetch<{ product: Product | null }>({
    query,
    variables: { handle },
  });

  return data.product;
}

// =============================================================================
// Cart Operations
// =============================================================================

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = []
): Promise<Cart> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartCreate: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: {
      input: {
        lines,
        buyerIdentity: {
          countryCode: "IN",
        },
      },
    },
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
  `;

  const data = await shopifyFetch<{ cart: Cart | null }>({
    query,
    variables: { cartId },
  });

  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lines },
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lines },
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lineIds },
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return data.cartLinesRemove.cart;
}

export async function updateCartBuyerIdentity(
  cartId: string,
  customerAccessToken: string
): Promise<Cart> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation UpdateCartBuyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartBuyerIdentityUpdate: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: {
      cartId,
      buyerIdentity: {
        customerAccessToken,
        countryCode: "IN",
      },
    },
  });

  if (data.cartBuyerIdentityUpdate.userErrors.length > 0) {
    throw new Error(data.cartBuyerIdentityUpdate.userErrors[0].message);
  }

  return data.cartBuyerIdentityUpdate.cart;
}

// =============================================================================
// Customer Authentication Operations
// =============================================================================

export async function customerCreate(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<{ customer: Customer; customerAccessToken: CustomerAccessToken }> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${ADDRESS_FRAGMENT}
    ${CUSTOMER_FRAGMENT}
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          ...CustomerFragment
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const createData = await shopifyFetch<{
    customerCreate: {
      customer: Customer | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: {
      input: {
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing: false,
      },
    },
  });

  if (createData.customerCreate.customerUserErrors.length > 0) {
    throw new Error(createData.customerCreate.customerUserErrors[0].message);
  }

  if (!createData.customerCreate.customer) {
    throw new Error("Failed to create customer");
  }

  // Auto-login after registration
  const tokenData = await customerAccessTokenCreate(email, password);

  return {
    customer: createData.customerCreate.customer,
    customerAccessToken: tokenData,
  };
}

export async function customerAccessTokenCreate(
  email: string,
  password: string
): Promise<CustomerAccessToken> {
  const query = `
    mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: {
      input: { email, password },
    },
  });

  if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
    throw new Error(
      data.customerAccessTokenCreate.customerUserErrors[0].message
    );
  }

  if (!data.customerAccessTokenCreate.customerAccessToken) {
    throw new Error("Invalid email or password");
  }

  return data.customerAccessTokenCreate.customerAccessToken;
}

export async function customerAccessTokenDelete(
  customerAccessToken: string
): Promise<boolean> {
  const query = `
    mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAccessTokenDelete: {
      deletedAccessToken: string | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken },
  });

  return !!data.customerAccessTokenDelete.deletedAccessToken;
}

export async function customerRecover(email: string): Promise<boolean> {
  const query = `
    mutation CustomerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerRecover: {
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: { email },
  });

  if (data.customerRecover.customerUserErrors.length > 0) {
    throw new Error(data.customerRecover.customerUserErrors[0].message);
  }

  return true;
}

export async function customerResetByUrl(
  resetUrl: string,
  password: string
): Promise<CustomerAccessToken> {
  const query = `
    mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
      customerResetByUrl(resetUrl: $resetUrl, password: $password) {
        customer {
          id
          email
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerResetByUrl: {
      customer: { id: string; email: string } | null;
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: { resetUrl, password },
  });

  if (data.customerResetByUrl.customerUserErrors.length > 0) {
    const error = data.customerResetByUrl.customerUserErrors[0];
    // Provide user-friendly error messages
    if (error.code === "TOKEN_INVALID") {
      throw new Error("This reset link is invalid. Please request a new one.");
    }
    if (error.code === "TOKEN_EXPIRED") {
      throw new Error("This reset link has expired. Please request a new one.");
    }
    throw new Error(error.message);
  }

  if (!data.customerResetByUrl.customerAccessToken) {
    throw new Error("Failed to reset password. Please try again.");
  }

  return data.customerResetByUrl.customerAccessToken;
}

export async function getCustomer(
  customerAccessToken: string
): Promise<Customer | null> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${ADDRESS_FRAGMENT}
    ${CUSTOMER_FRAGMENT}
    query GetCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        ...CustomerFragment
      }
    }
  `;

  const data = await shopifyFetch<{ customer: Customer | null }>({
    query,
    variables: { customerAccessToken },
  });

  return data.customer;
}

export async function getCustomerOrders(
  customerAccessToken: string,
  first: number = 20
): Promise<Order[]> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${ADDRESS_FRAGMENT}
    query GetCustomerOrders($customerAccessToken: String!, $first: Int!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 20) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image {
                        ...ImageFragment
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
              shippingAddress {
                ...AddressFragment
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customer: { orders: { edges: { node: Order }[] } } | null;
  }>({
    query,
    variables: { customerAccessToken, first },
  });

  return data.customer?.orders.edges.map((edge) => edge.node) || [];
}

export async function customerAddressCreate(
  customerAccessToken: string,
  address: Omit<Address, "id">
): Promise<Address> {
  const query = `
    ${ADDRESS_FRAGMENT}
    mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress {
          ...AddressFragment
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAddressCreate: {
      customerAddress: Address | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken, address },
  });

  if (data.customerAddressCreate.customerUserErrors.length > 0) {
    throw new Error(data.customerAddressCreate.customerUserErrors[0].message);
  }

  if (!data.customerAddressCreate.customerAddress) {
    throw new Error("Failed to create address");
  }

  return data.customerAddressCreate.customerAddress;
}

export async function customerAddressUpdate(
  customerAccessToken: string,
  addressId: string,
  address: Partial<Omit<Address, "id">>
): Promise<Address> {
  const query = `
    ${ADDRESS_FRAGMENT}
    mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress {
          ...AddressFragment
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAddressUpdate: {
      customerAddress: Address | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken, id: addressId, address },
  });

  if (data.customerAddressUpdate.customerUserErrors.length > 0) {
    throw new Error(data.customerAddressUpdate.customerUserErrors[0].message);
  }

  if (!data.customerAddressUpdate.customerAddress) {
    throw new Error("Failed to update address");
  }

  return data.customerAddressUpdate.customerAddress;
}

export async function customerAddressDelete(
  customerAccessToken: string,
  addressId: string
): Promise<boolean> {
  const query = `
    mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken, id: addressId },
  });

  if (data.customerAddressDelete.customerUserErrors.length > 0) {
    throw new Error(data.customerAddressDelete.customerUserErrors[0].message);
  }

  return !!data.customerAddressDelete.deletedCustomerAddressId;
}

export async function customerDefaultAddressUpdate(
  customerAccessToken: string,
  addressId: string
): Promise<Customer> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${ADDRESS_FRAGMENT}
    ${CUSTOMER_FRAGMENT}
    mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
      customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
        customer {
          ...CustomerFragment
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerDefaultAddressUpdate: {
      customer: Customer | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken, addressId },
  });

  if (data.customerDefaultAddressUpdate.customerUserErrors.length > 0) {
    throw new Error(
      data.customerDefaultAddressUpdate.customerUserErrors[0].message
    );
  }

  if (!data.customerDefaultAddressUpdate.customer) {
    throw new Error("Failed to update default address");
  }

  return data.customerDefaultAddressUpdate.customer;
}

// =============================================================================
// Customer Profile Update Operations
// =============================================================================

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}

export async function customerUpdate(
  customerAccessToken: string,
  customer: CustomerUpdateInput
): Promise<Customer> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${ADDRESS_FRAGMENT}
    ${CUSTOMER_FRAGMENT}
    mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          ...CustomerFragment
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerUpdate: {
      customer: Customer | null;
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken, customer },
  });

  if (data.customerUpdate.customerUserErrors.length > 0) {
    const error = data.customerUpdate.customerUserErrors[0];
    // Provide user-friendly error messages
    if (error.code === "TAKEN") {
      throw new Error("This email or phone number is already in use by another account.");
    }
    if (error.code === "INVALID") {
      throw new Error(`Invalid ${error.field?.join(" ") || "input"}: ${error.message}`);
    }
    throw new Error(error.message);
  }

  if (!data.customerUpdate.customer) {
    throw new Error("Failed to update customer profile");
  }

  return data.customerUpdate.customer;
}

// =============================================================================
// Waitlist / Newsletter Subscription
// =============================================================================

/**
 * Generate a secure random password for waitlist subscribers.
 * The password meets Shopify's requirements and includes:
 * - Uppercase letters
 * - Lowercase letters
 * - Numbers
 * - Special characters
 */
function generateRandomPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  
  // Generate 16 random characters
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add required character types to ensure complexity
  return password + "Aa1!";
}

export async function subscribeToWaitlist(phone: string): Promise<boolean> {
  // Generate a random password - user won't need it for waitlist
  // They can use "Forgot Password" if they ever want to create a real account
  const randomPassword = generateRandomPassword();
  
  // Clean phone number and format to E.164 format for Shopify
  let cleanPhone = phone.replace(/\D/g, '');
  
  // If phone starts with 91 and is 12 digits, it already has country code
  // If it's 10 digits, add +91 prefix for India
  if (cleanPhone.length === 10) {
    cleanPhone = `+91${cleanPhone}`;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    cleanPhone = `+${cleanPhone}`;
  } else if (!cleanPhone.startsWith('+')) {
    cleanPhone = `+${cleanPhone}`;
  }
  
  // Shopify requires email - generate a placeholder email from phone number
  const phoneDigits = phone.replace(/\D/g, '');
  const placeholderEmail = `${phoneDigits}@waitlist.optimist.in`;

  const query = `
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          phone
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerCreate: {
      customer: { id: string; phone: string } | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: {
      input: {
        email: placeholderEmail,
        phone: cleanPhone,
        password: randomPassword,
        acceptsMarketing: true,
      },
    },
  });

  const errors = data.customerCreate.customerUserErrors;
  
  // If phone/email already exists (TAKEN error), treat as success
  if (errors.length > 0) {
    const error = errors[0];
    if (error.code === "TAKEN") {
      // Phone already subscribed - this is fine
      return true;
    }
    throw new Error(error.message);
  }

  return true;
}

// =============================================================================
// Utility Functions
// =============================================================================

export function formatPrice(
  amount: string,
  currencyCode: string = "INR"
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}
