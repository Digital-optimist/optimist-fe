// GST invoice lookup service
// Calls the AWS Lambda endpoint that maps Shopify orders to Zoho-generated invoices.

export type InvoiceStatus = "available" | "pending" | "unavailable" | "failed";

export interface InvoiceLookupResult {
  status: InvoiceStatus;
  invoiceUrl?: string;
  invoiceNumber?: string;
  error?: string;
}

/**
 * Look up the GST invoice for a given Shopify order.
 *
 * Returns:
 * - "available": invoice is ready, `invoiceUrl` is set
 * - "pending":   webhook still processing, retry shortly
 * - "unavailable": no invoice (e.g. not a business order, or API not configured)
 * - "failed":    invoice creation failed; user-facing message in `error`
 */
export async function getInvoiceByOrder(
  shopifyOrderId: string,
): Promise<InvoiceLookupResult> {
  const baseUrl = process.env.NEXT_PUBLIC_INVOICE_API_URL;
  if (!baseUrl) {
    return { status: "unavailable" };
  }

  try {
    const response = await fetch(
      `${baseUrl}/by-order/${encodeURIComponent(shopifyOrderId)}`,
      {
        headers: { Accept: "application/json" },
      },
    );

    if (response.status === 404) {
      return { status: "unavailable" };
    }

    if (response.status === 202) {
      return { status: "pending" };
    }

    if (!response.ok) {
      return {
        status: "failed",
        error: "Unable to fetch invoice. Please try again later.",
      };
    }

    const data = (await response.json()) as {
      invoiceUrl?: string;
      invoiceNumber?: string;
      status?: InvoiceStatus;
    };

    if (data.status && data.status !== "available") {
      return { status: data.status, error: data.status === "failed" ? "Invoice generation failed" : undefined };
    }

    if (data.invoiceUrl) {
      return {
        status: "available",
        invoiceUrl: data.invoiceUrl,
        invoiceNumber: data.invoiceNumber,
      };
    }

    return { status: "unavailable" };
  } catch {
    return {
      status: "failed",
      error: "Network error. Please try again later.",
    };
  }
}

/**
 * Returns true if the Shopify order has business-purchase attributes attached.
 */
export function isBusinessOrder(
  customAttributes: { key: string; value: string }[] | undefined,
): boolean {
  if (!customAttributes) return false;
  return customAttributes.some(
    (a) => a.key === "Business Purchase" && a.value === "Yes",
  );
}

/**
 * Reads a custom attribute value from an order.
 */
export function getOrderAttribute(
  customAttributes: { key: string; value: string }[] | undefined,
  key: string,
): string | undefined {
  return customAttributes?.find((a) => a.key === key)?.value;
}
