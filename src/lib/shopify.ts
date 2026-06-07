// Shopify Storefront API Client and GraphQL Operations

const domain =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
  "octolife-3.myshopify.com";
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ||
  "3b12d6020365806434052cc061a5b5e3";
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-01";

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

export interface VideoSource {
  url: string;
  mimeType: string;
  format: string;
  width: number;
  height: number;
}

export interface MediaNode {
  mediaContentType: "IMAGE" | "VIDEO" | "EXTERNAL_VIDEO" | "MODEL_3D";
  image?: ShopifyImage;
  sources?: VideoSource[];
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
  media: {
    edges: { node: MediaNode }[];
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

export interface OrderLineItem {
  title: string;
  quantity: number;
  variant: {
    id: string;
    image: ShopifyImage | null;
    price: {
      amount: string;
      currencyCode: string;
    };
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      handle: string;
    } | null;
  } | null;
}

export interface OrderFulfillment {
  trackingCompany: string | null;
  trackingInfo: {
    number: string | null;
    url: string | null;
  }[];
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
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalTax: {
    amount: string;
    currencyCode: string;
  } | null;
  totalShippingPrice: {
    amount: string;
    currencyCode: string;
  };
  statusUrl: string;
  lineItems: {
    edges: {
      node: OrderLineItem;
    }[];
  };
  shippingAddress: Address | null;
  successfulFulfillments: OrderFulfillment[];
  customAttributes: { key: string; value: string }[];
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

// Carries Shopify's customerUserErrors[].code alongside the message so callers
// can branch on specific error states (e.g. UNIDENTIFIED_CUSTOMER → offer the
// activation-email flow instead of just showing a generic failure).
export class ShopifyCustomerError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "ShopifyCustomerError";
  }
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
      `Shopify API error: ${response.status} ${response.statusText}`,
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
    images(first: 20) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    media(first: 20) {
      edges {
        node {
          mediaContentType
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
          ... on Video {
            sources {
              url
              mimeType
              format
              width
              height
            }
          }
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
    },
  );

  return data.products.edges.map((edge) => edge.node);
}

// =============================================================================
// Cart Operations
// =============================================================================

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = [],
  attributes?: { key: string; value: string }[],
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

  const input: Record<string, unknown> = {
    lines,
    buyerIdentity: {
      countryCode: "IN",
    },
  };
  if (attributes?.length) {
    input.attributes = attributes;
  }

  const data = await shopifyFetch<{
    cartCreate: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { input },
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
  lines: { merchandiseId: string; quantity: number }[],
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
  lines: { id: string; quantity: number }[],
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
  lineIds: string[],
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
  customerAccessToken: string,
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

export async function updateCartAttributes(
  cartId: string,
  attributes: { key: string; value: string }[],
): Promise<Cart> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
      cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
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
    cartAttributesUpdate: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { cartId, attributes },
  });

  if (data.cartAttributesUpdate.userErrors.length > 0) {
    throw new Error(data.cartAttributesUpdate.userErrors[0].message);
  }

  return data.cartAttributesUpdate.cart;
}

// =============================================================================
// Customer Authentication Operations
// =============================================================================

export async function customerCreate(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
): Promise<{
  customer: Customer;
  customerAccessToken: CustomerAccessToken | null;
}> {
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

  // Attempt auto-login. When the store requires email verification the
  // customer is created in a disabled state and token creation will fail —
  // return null so callers can show the "check your email" state instead of
  // surfacing a cryptic "Unidentified customer" error.
  let customerAccessToken: CustomerAccessToken | null = null;
  try {
    customerAccessToken = await customerAccessTokenCreate(email, password);
  } catch {
    customerAccessToken = null;
  }

  return {
    customer: createData.customerCreate.customer,
    customerAccessToken,
  };
}

export async function customerAccessTokenCreate(
  email: string,
  password: string,
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
    const error = data.customerAccessTokenCreate.customerUserErrors[0];
    // UNIDENTIFIED_CUSTOMER is Shopify's catch-all for "wrong password OR no
    // password set yet." Legacy/guest-checkout customers fall into the second
    // bucket — they need the activation flow via customerRecover.
    if (error.code === "UNIDENTIFIED_CUSTOMER") {
      throw new ShopifyCustomerError(
        'Incorrect email or password. If you\'ve ordered with us before but never set a password, click "Forgot Password?" below to activate your account.',
        error.code,
      );
    }
    throw new ShopifyCustomerError(error.message, error.code);
  }

  if (!data.customerAccessTokenCreate.customerAccessToken) {
    throw new ShopifyCustomerError(
      "Invalid email or password",
      "UNIDENTIFIED_CUSTOMER",
    );
  }

  return data.customerAccessTokenCreate.customerAccessToken;
}

export async function customerAccessTokenDelete(
  customerAccessToken: string,
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
    console.warn(
      "customerRecover user errors suppressed:",
      data.customerRecover.customerUserErrors,
    );
  }

  return true;
}

export async function customerResetByUrl(
  resetUrl: string,
  password: string,
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

export async function customerActivateByUrl(
  activationUrl: string,
  password: string,
): Promise<CustomerAccessToken> {
  const query = `
    mutation customerActivateByUrl($activationUrl: URL!, $password: String!) {
      customerActivateByUrl(activationUrl: $activationUrl, password: $password) {
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
    customerActivateByUrl: {
      customer: { id: string; email: string } | null;
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: { activationUrl, password },
  });

  if (data.customerActivateByUrl.customerUserErrors.length > 0) {
    const error = data.customerActivateByUrl.customerUserErrors[0];
    if (error.code === "TOKEN_INVALID") {
      throw new Error(
        "This activation link is invalid. Please request a new one.",
      );
    }
    if (error.code === "TOKEN_EXPIRED") {
      throw new Error(
        "This activation link has expired. Please request a new one.",
      );
    }
    if (error.code === "ALREADY_ENABLED") {
      throw new Error(
        "Your account is already activated. Please sign in with your password.",
      );
    }
    throw new Error(error.message);
  }

  if (!data.customerActivateByUrl.customerAccessToken) {
    throw new Error("Failed to activate account. Please try again.");
  }

  return data.customerActivateByUrl.customerAccessToken;
}

export async function getCustomer(
  customerAccessToken: string,
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
  first: number = 20,
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
              subtotalPrice {
                amount
                currencyCode
              }
              totalTax {
                amount
                currencyCode
              }
              totalShippingPrice {
                amount
                currencyCode
              }
              statusUrl
              lineItems(first: 20) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      image {
                        ...ImageFragment
                      }
                      price {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      product {
                        handle
                      }
                    }
                  }
                }
              }
              shippingAddress {
                ...AddressFragment
              }
              successfulFulfillments(first: 5) {
                trackingCompany
                trackingInfo(first: 5) {
                  number
                  url
                }
              }
              customAttributes {
                key
                value
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
  address: Omit<Address, "id">,
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
  address: Partial<Omit<Address, "id">>,
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
  addressId: string,
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
  customer: CustomerUpdateInput,
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
      throw new Error(
        "This email or phone number is already in use by another account.",
      );
    }
    if (error.code === "INVALID") {
      throw new Error(
        `Invalid ${error.field?.join(" ") || "input"}: ${error.message}`,
      );
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
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  // Generate 16 random characters
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Add required character types to ensure complexity
  return password + "Aa1!";
}

export async function subscribeToWaitlist(
  phone: string,
  name?: string,
): Promise<boolean> {
  const randomPassword = generateRandomPassword();

  let cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 10) {
    cleanPhone = `+91${cleanPhone}`;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
    cleanPhone = `+${cleanPhone}`;
  } else if (!cleanPhone.startsWith("+")) {
    cleanPhone = `+${cleanPhone}`;
  }

  const phoneDigits = phone.replace(/\D/g, "");
  const placeholderEmail = `${phoneDigits}@waitlist.optimist.in`;

  const nameParts = name?.trim().split(/\s+/) || [];
  const firstName = nameParts[0] || undefined;
  const lastName =
    nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;

  const query = `
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          phone
          firstName
          lastName
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
      customer: {
        id: string;
        phone: string;
        firstName: string | null;
        lastName: string | null;
      } | null;
      customerUserErrors: { field: string[]; message: string; code: string }[];
    };
  }>({
    query,
    variables: {
      input: {
        email: placeholderEmail,
        phone: cleanPhone,
        password: randomPassword,
        firstName,
        lastName,
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
// Contact Form Submission (Google Sheets + Drive)
// =============================================================================

export interface ContactFormData {
  reason: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  cityPincode: string;
  serialNumber?: string;
  orderId?: string;
  message: string;
  attachedFile?: File | null;
}

export interface ContactFormSubmissionResult {
  success: boolean;
  error?: string;
}

const GOOGLE_SHEETS_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL || "";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactFormSubmissionResult> {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return {
      success: false,
      error: "Form submission is not configured. Please contact support.",
    };
  }

  let fileData = null;
  if (data.attachedFile) {
    try {
      const base64 = await fileToBase64(data.attachedFile);
      fileData = {
        name: data.attachedFile.name,
        type: data.attachedFile.type,
        base64: base64,
      };
    } catch {
      // File processing failed, continue without attachment
    }
  }

  const payload = {
    reason: data.reason,
    fullName: data.fullName,
    mobileNumber: `+91${data.mobileNumber}`,
    email: data.email || "",
    cityPincode: data.cityPincode,
    serialNumber: data.serialNumber || "",
    orderId: data.orderId || "",
    message: data.message,
    file: fileData,
  };

  try {
    // GAS doesn't handle CORS preflight (OPTIONS). Using text/plain avoids
    // the preflight, and no-cors handles GAS's 302 redirect to a different origin.
    // The tradeoff: we get an opaque response, so we assume success if no network error.
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit form",
    };
  }
}

// =============================================================================
// Customer Feedback Form Submission (separate Google Sheet)
// =============================================================================

export interface FeedbackFormRatings {
  deliveryOnTime: number;
  packagingCondition: number;
  deliveryOverall: number;
  installationOnTime: number;
  installationProfessional: number;
  installationNeat: number;
  technicianExplained: number;
  installationOverall: number;
}

export interface FeedbackFormData {
  phone: string;
  ratings: FeedbackFormRatings;
  comments: string;
}

const FEEDBACK_WEBHOOK_URL = process.env.NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL || "";

// Format a Date as IST in "YYYY-MM-DD HH:mm:ss" — Sheets auto-parses this as a
// datetime cell, and it's sortable lexicographically.
function formatIST(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
    "minute",
  )}:${get("second")}`;
}

export async function submitFeedbackForm(
  data: FeedbackFormData,
): Promise<ContactFormSubmissionResult> {
  if (!FEEDBACK_WEBHOOK_URL) {
    return {
      success: false,
      error: "Form submission is not configured. Please contact support.",
    };
  }

  const payload = {
    phone: `+91${data.phone}`,
    ...data.ratings,
    comments: data.comments || "",
    submittedAt: formatIST(new Date()),
  };

  try {
    // Same no-cors + text/plain trick as submitContactForm — avoids GAS's
    // CORS preflight and handles its 302 redirect to a different origin.
    await fetch(FEEDBACK_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit form",
    };
  }
}

// =============================================================================
// Blog Types
// =============================================================================

export interface BlogArticle {
  id: string;
  handle: string;
  title: string;
  content: string;
  contentHtml: string;
  excerpt: string | null;
  excerptHtml: string | null;
  publishedAt: string;
  image: ShopifyImage | null;
  author: {
    name: string;
    email: string | null;
  } | null;
  blog: {
    id: string;
    handle: string;
    title: string;
  };
  tags: string[];
  seo: {
    title: string | null;
    description: string | null;
  } | null;
}

// =============================================================================
// Blog GraphQL Fragments
// =============================================================================

const ARTICLE_FRAGMENT = `
  fragment ArticleFragment on Article {
    id
    handle
    title
    content
    contentHtml
    excerpt
    excerptHtml
    publishedAt
    image {
      ...ImageFragment
    }
    author: authorV2 {
      name
      email
    }
    blog {
      id
      handle
      title
    }
    tags
    seo {
      title
      description
    }
  }
`;

// =============================================================================
// Blog Operations
// =============================================================================

export async function getArticles(
  first: number = 20,
  after?: string,
  query?: string,
): Promise<{
  articles: BlogArticle[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}> {
  const gqlQuery = `
    ${IMAGE_FRAGMENT}
    ${ARTICLE_FRAGMENT}
    query GetArticles($first: Int!, $after: String, $query: String) {
      articles(first: $first, after: $after, query: $query, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            ...ArticleFragment
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    articles: {
      edges: { node: BlogArticle }[];
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string | null;
        endCursor: string | null;
      };
    };
  }>({
    query: gqlQuery,
    variables: { first, after, query },
  });

  return {
    articles: data.articles.edges.map((edge) => edge.node),
    pageInfo: data.articles.pageInfo,
  };
}

export async function getArticleByHandle(
  blogHandle: string,
  articleHandle: string,
): Promise<BlogArticle | null> {
  const query = `
    ${IMAGE_FRAGMENT}
    ${ARTICLE_FRAGMENT}
    query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) {
          ...ArticleFragment
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    blog: { articleByHandle: BlogArticle | null } | null;
  }>({
    query,
    variables: { blogHandle, articleHandle },
  });

  return data.blog?.articleByHandle || null;
}

// Helper function to calculate read time
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper function to format date
export function formatArticleDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// =============================================================================
// Metaobject Types
// =============================================================================

export interface RichTextNode {
  type: string;
  value?: string;
  level?: number;
  listType?: string;
  children?: RichTextNode[];
}

export interface VideoSource {
  url: string;
  mimeType: string;
}

export interface CustomerReviewItem {
  name: string;
  rating: number;
  videoSources: VideoSource[];
  previewImageUrl: string | null;
}

export interface ExpertTestimonialItem {
  name: string;
  profession: string;
  review: string;
  imageUrl: string | null;
}

export interface ResultSectionItem {
  heading: string;
  subHeading: string;
  iconUrl: string | null;
}

export interface ResultSectionData {
  sectionHeading: string;
  items: ResultSectionItem[];
}

export interface VariantRichText {
  "1_0_ton": RichTextNode | null;
  "1_5_ton": RichTextNode | null;
  "2_0_ton": RichTextNode | null;
}

export interface ProductPageContent {
  warrantyReturnInfo: VariantRichText;
  productMoreInfo: VariantRichText;
  resultSection: ResultSectionData;
  customerReviews: CustomerReviewItem[];
  expertTestimonials: ExpertTestimonialItem[];
}

export interface HeroBadge {
  imageUrl: string;
  text: string;
}

export interface TestimonialItem {
  name: string;
  profession: string;
  location: string;
  review: string;
  imageUrl: string | null;
}

export interface LandingPageContent {
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  heroBadges: HeroBadge[];
  testimonials: TestimonialItem[];
  footerImageUrl: string | null;
}

// =============================================================================
// Metaobject GraphQL Queries
// =============================================================================

const PRODUCT_PAGE_CONTENT_QUERY = `
  query GetProductPageContent($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      handle
      type
      fields {
        key
        value
        type
        reference {
          ... on Metaobject {
            handle
            type
            fields {
              key
              value
              type
              reference {
                ... on MediaImage {
                  image { url altText }
                }
              }
              references(first: 10) {
                nodes {
                  ... on Metaobject {
                    handle
                    type
                    fields {
                      key
                      value
                      type
                      reference {
                        ... on MediaImage {
                          image { url altText }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          ... on MediaImage {
            image { url altText }
          }
          ... on Video {
            sources { url mimeType }
            previewImage { url }
          }
        }
        references(first: 20) {
          nodes {
            ... on Metaobject {
              handle
              type
              fields {
                key
                value
                type
                reference {
                  ... on MediaImage {
                    image { url altText }
                  }
                  ... on Video {
                    sources { url mimeType }
                    previewImage { url }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const LANDING_PAGE_CONTENT_QUERY = `
  query GetLandingPageContent($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      handle
      type
      fields {
        key
        value
        type
        reference {
          ... on MediaImage {
            image { url altText }
          }
        }
        references(first: 20) {
          nodes {
            ... on Metaobject {
              handle
              type
              fields {
                key
                value
                type
                reference {
                  ... on MediaImage {
                    image { url altText }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// =============================================================================
// Metaobject Helpers
// =============================================================================

function getFieldValue(
  fields: Array<{
    key: string;
    value: string | null;
    type: string;
    reference?: unknown;
    references?: unknown;
  }>,
  key: string,
): string | null {
  return fields.find((f) => f.key === key)?.value ?? null;
}

function getFieldReference(
  fields: Array<{ key: string; reference?: unknown }>,
  key: string,
): unknown {
  return fields.find((f) => f.key === key)?.reference ?? null;
}

function getFieldReferences(
  fields: Array<{ key: string; references?: { nodes: unknown[] } }>,
  key: string,
): unknown[] {
  return fields.find((f) => f.key === key)?.references?.nodes ?? [];
}

function parseRichText(value: string | null): RichTextNode | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as RichTextNode;
  } catch {
    return null;
  }
}

function parseVariantRichText(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[],
): VariantRichText {
  return {
    "1_0_ton": parseRichText(getFieldValue(fields, "1_0_ton")),
    "1_5_ton": parseRichText(getFieldValue(fields, "1_5_ton")),
    "2_0_ton": parseRichText(getFieldValue(fields, "2_0_ton")),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseResultSection(ref: any): ResultSectionData {
  const fields = ref?.fields ?? [];
  const heading = getFieldValue(fields, "section_heading") ?? "The Result.";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemNodes = getFieldReferences(fields, "section_items") as any[];
  const items: ResultSectionItem[] = itemNodes.map((node) => {
    const f = node.fields ?? [];
    return {
      heading: getFieldValue(f, "heading") ?? "",
      subHeading: getFieldValue(f, "sub_heading") ?? "",
      iconUrl:
        (getFieldReference(f, "icon") as { image?: { url: string } })?.image
          ?.url ?? null,
    };
  });
  return { sectionHeading: heading, items };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCustomerReviews(nodes: any[]): CustomerReviewItem[] {
  return nodes.map((node) => {
    const fields = node.fields ?? [];
    const videoRef = getFieldReference(fields, "video") as {
      sources?: VideoSource[];
      previewImage?: { url: string };
    } | null;
    return {
      name: getFieldValue(fields, "name") ?? "",
      rating: parseInt(getFieldValue(fields, "rating_out_of_5") ?? "5", 10),
      videoSources: videoRef?.sources ?? [],
      previewImageUrl: videoRef?.previewImage?.url ?? null,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseExpertTestimonials(nodes: any[]): ExpertTestimonialItem[] {
  return nodes.map((node) => {
    const fields = node.fields ?? [];
    const imageRef = getFieldReference(fields, "image") as {
      image?: { url: string };
    } | null;
    return {
      name: getFieldValue(fields, "name") ?? "",
      profession: getFieldValue(fields, "profession") ?? "",
      review: getFieldValue(fields, "review") ?? "",
      imageUrl: imageRef?.image?.url ?? null,
    };
  });
}

// =============================================================================
// Metaobject Fetch Functions
// =============================================================================

export async function getProductPageContent(): Promise<ProductPageContent | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await shopifyFetch<any>({
      query: PRODUCT_PAGE_CONTENT_QUERY,
      variables: {
        handle: { handle: "product-page-content", type: "product_page" },
      },
    });

    const metaobject = data?.metaobject;
    if (!metaobject) return null;

    const fields = metaobject.fields ?? [];

    const warrantyRef = getFieldReference(fields, "warranty_return_info") as {
      fields?: unknown[];
    } | null;
    const moreInfoRef = getFieldReference(fields, "product_more_info") as {
      fields?: unknown[];
    } | null;
    const resultRef = getFieldReference(fields, "result_section");
    const customerNodes = getFieldReferences(
      fields,
      "hear_it_from_our_customers_content",
    );
    const expertNodes = getFieldReferences(
      fields,
      "industry_experts_section_content",
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      warrantyReturnInfo: parseVariantRichText(
        (warrantyRef?.fields as any[]) ?? [],
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      productMoreInfo: parseVariantRichText(
        (moreInfoRef?.fields as any[]) ?? [],
      ),
      resultSection: parseResultSection(resultRef),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customerReviews: parseCustomerReviews(customerNodes as any[]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expertTestimonials: parseExpertTestimonials(expertNodes as any[]),
    };
  } catch (error) {
    return null;
  }
}

export async function getLandingPageContent(): Promise<LandingPageContent | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await shopifyFetch<any>({
      query: LANDING_PAGE_CONTENT_QUERY,
      variables: {
        handle: { handle: "landing-page-content", type: "landing_page" },
      },
    });

    const metaobject = data?.metaobject;
    if (!metaobject) return null;

    const fields = metaobject.fields ?? [];

    const heroHeadingLine1 =
      getFieldValue(fields, "hero_section_heading") ?? "India's Real AC.";
    const heroHeadingLine2 =
      getFieldValue(fields, "hero_section_heading_line_2") ??
      "Cools More. Uses Less.";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const badgeNodes = getFieldReferences(
      fields,
      "hero_section_icon_and_text",
    ) as any[];
    const heroBadges: HeroBadge[] = badgeNodes.map((node) => {
      const f = node.fields ?? [];
      const imageRef = getFieldReference(f, "image") as {
        image?: { url: string };
      } | null;
      return {
        imageUrl: imageRef?.image?.url ?? "",
        text: getFieldValue(f, "text") ?? "",
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const testimonialNodes = getFieldReferences(
      fields,
      "testimonials",
    ) as any[];
    const testimonials: TestimonialItem[] = testimonialNodes.map((node) => {
      const f = node.fields ?? [];
      const imageRef = getFieldReference(f, "image") as {
        image?: { url: string };
      } | null;
      return {
        name: getFieldValue(f, "name") ?? "",
        profession: getFieldValue(f, "date") ?? "",
        location: getFieldValue(f, "location") ?? "",
        review: getFieldValue(f, "review") ?? "",
        imageUrl: imageRef?.image?.url ?? null,
      };
    });

    const footerImageRef = getFieldReference(fields, "footer_image") as {
      image?: { url: string };
    } | null;

    return {
      heroHeadingLine1,
      heroHeadingLine2,
      heroBadges,
      testimonials,
      footerImageUrl: footerImageRef?.image?.url ?? null,
    };
  } catch (error) {
    return null;
  }
}

// =============================================================================
// Home Page (/home) Metaobject — "hp_herosection"
// =============================================================================
//
// Schema (verified against the Storefront API):
//   hp_herosection (handle: "say-hello-to-your")
//     heading_line_1  single_line_text_field
//     heading_line_2  single_line_text_field
//     title           multi_line_text_field
//     subtitle        multi_line_text_field
//     features        list.metaobject_reference -> title_subtitle_image[]
//                       image     file_reference (MediaImage)  — the card icon
//                       title     multi_line_text_field
//                       subtitle  multi_line_text_field
//
// NOTE: this is fetched at build time (static export), so editing the
// metaobject in Shopify admin requires a rebuild to appear on /home.

export interface HomeFeatureCard {
  /** Icon image (served from Shopify CDN). For the "Lower bills" card this is
   *  the "25–35%" graphic rather than a glyph. */
  iconUrl: string | null;
  iconAlt: string | null;
  title: string;
  subtitle: string;
}

export interface HomeHeroContent {
  headingLine1: string;
  headingLine2: string;
  title: string;
  subtitle: string;
  features: HomeFeatureCard[];
}

export interface HomeProductDisplayContent {
  title: string;
  subtitle: string;
  features: HomeFeatureCard[];
}

export interface HomeInsideTechContent {
  title: string;
  subtitle: string;
  // Each card reuses the title_subtitle_image shape: iconUrl = card background
  // photo, title = headline, subtitle = the on-hover description.
  cards: HomeFeatureCard[];
}

export interface HomeAppFeaturesContent {
  title: string;
  subtitle: string;
  description: string;
  mainImageUrl: string | null;
  mainImageAlt: string | null;
  features: HomeFeatureCard[];
}

export interface HomeComparisonRow {
  iconUrl: string | null;
  iconAlt: string | null;
  feature: string;
  // Value shown in the "Other AC's" column / value shown in the "optimist"
  // column. NOTE: the metaobject's field keys are swapped relative to their
  // names (see parseComparisonRows).
  otherAc: string;
  optimist: string;
}

export interface HomeComparisonContent {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  rows: HomeComparisonRow[];
}

export interface HomeReviewVideo {
  posterUrl: string | null;
  mp4Url: string | null;
  hlsUrl: string | null;
}

export interface HomeReviewsContent {
  subtitle: string;
  title: string;
  mainLine: string;
  earlyUsers: number;
  unitsSold: number;
  videos: HomeReviewVideo[];
}

export interface HomePageContent {
  hero: HomeHeroContent | null;
  productDisplay: HomeProductDisplayContent | null;
  insideTech: HomeInsideTechContent | null;
  appFeatures: HomeAppFeaturesContent | null;
  comparison: HomeComparisonContent | null;
  reviews: HomeReviewsContent | null;
}

const HOME_HERO_QUERY = `
  query GetHomeHeroContent($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      handle
      type
      fields {
        key
        value
        type
        reference {
          ... on MediaImage {
            image { url altText }
          }
        }
        references(first: 10) {
          nodes {
            ... on Metaobject {
              handle
              type
              fields {
                key
                value
                type
                reference {
                  ... on MediaImage {
                    image { url altText }
                  }
                }
              }
            }
            ... on MediaImage {
              image { url altText }
            }
            ... on Video {
              sources { url mimeType format }
              previewImage { url }
            }
          }
        }
      }
    }
  }
`;

// Parse a list field (list.metaobject_reference -> title_subtitle_image) into
// HomeFeatureCard[]. Shared by the hero, product-display and inside-tech
// sections. `listKey` is the field holding the references ("features" / "content").
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseHomeFeatureCards(fields: any[], listKey = "features"): HomeFeatureCard[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featureNodes = getFieldReferences(fields, listKey) as any[];
  return featureNodes.map((node) => {
    const f = node.fields ?? [];
    const imageRef = getFieldReference(f, "image") as {
      image?: { url: string; altText: string | null };
    } | null;
    return {
      iconUrl: imageRef?.image?.url ?? null,
      iconAlt: imageRef?.image?.altText ?? null,
      title: getFieldValue(f, "title") ?? "",
      subtitle: getFieldValue(f, "subtitle") ?? "",
    };
  });
}

// Parse the comparison section's feature rows (list.metaobject_reference ->
// ac_compariosn_item). Each item has `feature`, `image`, and two value fields.
// IMPORTANT: the metaobject's keys are swapped vs their names — the value the
// design renders under "Other AC's" is stored in `optimist_ac_comparison`, and
// the value rendered under the "optimist" column is in `other_ac_comparison`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseComparisonRows(fields: any[], listKey = "features"): HomeComparisonRow[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes = getFieldReferences(fields, listKey) as any[];
  return nodes.map((node) => {
    const f = node.fields ?? [];
    const imageRef = getFieldReference(f, "image") as {
      image?: { url: string; altText: string | null };
    } | null;
    return {
      iconUrl: imageRef?.image?.url ?? null,
      iconAlt: imageRef?.image?.altText ?? null,
      feature: getFieldValue(f, "feature") ?? "",
      otherAc: getFieldValue(f, "optimist_ac_comparison") ?? "",
      optimist: getFieldValue(f, "other_ac_comparison") ?? "",
    };
  });
}

// Parse the reviews section's `videos` list (list.file_reference -> Video). Each
// node is a Shopify-hosted Video with multiple mp4 renditions + a posterImage.
// We prefer the 720p mp4 (good quality, modest size) for the modal player.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseReviewVideos(fields: any[], listKey = "videos"): HomeReviewVideo[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes = getFieldReferences(fields, listKey) as any[];
  return nodes.map((node) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sources: any[] = node.sources ?? [];
    const mp4s = sources.filter((s) => s.format === "mp4");
    const mp4 =
      mp4s.find((s) => typeof s.url === "string" && s.url.includes("720p")) ??
      mp4s[0] ??
      null;
    const hls = sources.find((s) => s.format === "m3u8") ?? null;
    return {
      posterUrl: node.previewImage?.url ?? null,
      mp4Url: mp4?.url ?? null,
      hlsUrl: hls?.url ?? null,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchHomeMetaobject(handle: string, type: string): Promise<any | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await shopifyFetch<any>({
      query: HOME_HERO_QUERY,
      variables: { handle: { handle, type } },
    });
    return data?.metaobject ?? null;
  } catch {
    return null;
  }
}

export async function getHomePageContent(): Promise<HomePageContent | null> {
  try {
    const [
      heroObj,
      productObj,
      insideTechObj,
      appFeaturesObj,
      comparisonObj,
      reviewsObj,
    ] = await Promise.all([
        fetchHomeMetaobject("say-hello-to-your", "hp_herosection"),
        fetchHomeMetaobject(
          "designed-right-for-india-cools-120-to-300-sq-ft-rooms",
          "hp_product_display",
        ),
        fetchHomeMetaobject(
          "good-engineering-is-invisible-until-you-feel-it",
          "hp_inside_tech",
        ),
        fetchHomeMetaobject(
          "the-perfect-companion-for-control",
          "hp_ac_mobile_features",
        ),
        fetchHomeMetaobject("here-is-why-we-built", "hp_ac_comparison"),
        fetchHomeMetaobject(
          "we-could-tell-you-how-good-it-is-but-theyll-do-it-better",
          "hp_reviews_section",
        ),
      ]);

    const hero: HomeHeroContent | null = heroObj
      ? {
          headingLine1:
            getFieldValue(heroObj.fields, "heading_line_1") ??
            "Say hello to your",
          headingLine2:
            getFieldValue(heroObj.fields, "heading_line_2") ?? "optimist",
          title:
            getFieldValue(heroObj.fields, "title") ??
            "Built for 50°C summers, not 24°C showrooms.",
          subtitle: getFieldValue(heroObj.fields, "subtitle") ?? "",
          features: parseHomeFeatureCards(heroObj.fields ?? []),
        }
      : null;

    const productDisplay: HomeProductDisplayContent | null = productObj
      ? {
          title: getFieldValue(productObj.fields, "title") ?? "Buy your Optimist",
          subtitle: getFieldValue(productObj.fields, "subtitle") ?? "",
          features: parseHomeFeatureCards(productObj.fields ?? []),
        }
      : null;

    const insideTech: HomeInsideTechContent | null = insideTechObj
      ? {
          title:
            getFieldValue(insideTechObj.fields, "title") ??
            "Good engineering is invisible. Until you feel it.",
          subtitle:
            getFieldValue(insideTechObj.fields, "subtitle") ??
            "What’s under the hood?",
          cards: parseHomeFeatureCards(insideTechObj.fields ?? [], "content"),
        }
      : null;

    const mainImageRef = appFeaturesObj
      ? (getFieldReference(appFeaturesObj.fields, "main_image") as {
          image?: { url: string; altText: string | null };
        } | null)
      : null;

    const appFeatures: HomeAppFeaturesContent | null = appFeaturesObj
      ? {
          title:
            getFieldValue(appFeaturesObj.fields, "title") ??
            "The perfect companion for control",
          subtitle:
            getFieldValue(appFeaturesObj.fields, "subtitle") ??
            "All controls in your hand",
          description: getFieldValue(appFeaturesObj.fields, "description") ?? "",
          mainImageUrl: mainImageRef?.image?.url ?? null,
          mainImageAlt: mainImageRef?.image?.altText ?? null,
          features: parseHomeFeatureCards(appFeaturesObj.fields ?? []),
        }
      : null;

    const comparison: HomeComparisonContent | null = comparisonObj
      ? {
          titleLine1:
            getFieldValue(comparisonObj.fields, "title_line_1") ??
            "Here is why we built",
          titleLine2:
            getFieldValue(comparisonObj.fields, "title_line_2") ??
            "Optimist for you",
          subtitle:
            getFieldValue(comparisonObj.fields, "subtitle") ?? "Why Optimist?",
          rows: parseComparisonRows(comparisonObj.fields ?? []),
        }
      : null;

    const reviews: HomeReviewsContent | null = reviewsObj
      ? {
          subtitle:
            getFieldValue(reviewsObj.fields, "subtitle") ??
            "Real People. Real Summers.",
          title:
            getFieldValue(reviewsObj.fields, "title") ??
            "We could tell you how good it is. But they'll do it better.",
          mainLine: getFieldValue(reviewsObj.fields, "main_line") ?? "",
          earlyUsers: Number(
            getFieldValue(reviewsObj.fields, "early_users") ?? 0,
          ),
          unitsSold: Number(getFieldValue(reviewsObj.fields, "units_sold") ?? 0),
          videos: parseReviewVideos(reviewsObj.fields ?? []),
        }
      : null;

    if (
      !hero &&
      !productDisplay &&
      !insideTech &&
      !appFeatures &&
      !comparison &&
      !reviews
    )
      return null;

    return {
      hero,
      productDisplay,
      insideTech,
      appFeatures,
      comparison,
      reviews,
    };
  } catch {
    return null;
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

export function formatPrice(
  amount: string,
  currencyCode: string = "INR",
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}
