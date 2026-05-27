"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer"

import { Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useShopStore } from "@/stores/shop/shopStore"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

interface ReceiptPDFProps {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  transactionId: string

  customerInfo?: {
    name?: string
    phone?: string
    email?: string
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 9,
    fontFamily: "Helvetica",
  },

  header: {
    textAlign: "center",
    marginBottom: 8,
  },

  storeName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },

  smallText: {
    fontSize: 8,
    marginBottom: 1,
  },

  divider: {
    borderBottom: "1px dashed #000",
    marginVertical: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  itemLeft: {
    width: "70%",
  },

  itemRight: {
    width: "30%",
    textAlign: "right",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  totalText: {
    fontSize: 11,
    fontWeight: "bold",
  },

  section: {
    marginTop: 6,
  },

  footer: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 8,
  },
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const ReceiptDocument = ({
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
  transactionId,
  customerInfo,
  shop,
}: ReceiptPDFProps & { shop: any }) => (
  <Document>
    <Page
      size={[226, 800]}
      style={styles.page}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.storeName}>
          {shop?.name || "TECAM SMS"}
        </Text>

        {shop?.address && (
          <Text style={styles.smallText}>
            {shop.address}
          </Text>
        )}

        {shop?.phone && (
          <Text style={styles.smallText}>
            {shop.phone}
          </Text>
        )}

        {shop?.email && (
          <Text style={styles.smallText}>
            {shop.email}
          </Text>
        )}

        <Text style={styles.smallText}>
          Receipt #{transactionId}
        </Text>

        <Text style={styles.smallText}>
          {new Date().toLocaleString()}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Customer */}
      {(customerInfo?.name ||
        customerInfo?.phone ||
        customerInfo?.email) && (
        <>
          <View style={styles.section}>
            <Text>
              Customer: {customerInfo.name || "-"}
            </Text>

            {customerInfo.phone && (
              <Text>
                Phone: {customerInfo.phone}
              </Text>
            )}

            {customerInfo.email && (
              <Text>
                Email: {customerInfo.email}
              </Text>
            )}
          </View>

          <View style={styles.divider} />
        </>
      )}

      {/* Items */}
      {items.map((item) => (
        <View
          key={item.id}
          style={styles.row}
        >
          <View style={styles.itemLeft}>
            <Text>{item.name}</Text>

            <Text>
              {item.quantity} × Mk{" "}
              {formatAmount(item.price)}
            </Text>
          </View>

          <Text style={styles.itemRight}>
            Mk{" "}
            {formatAmount(
              item.price * item.quantity
            )}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      {/* Totals */}
      <View style={styles.row}>
        <Text>Subtotal</Text>

        <Text>
          Mk {formatAmount(subtotal)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text>VAT</Text>

        <Text>
          Mk {formatAmount(tax)}
        </Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>
          TOTAL
        </Text>

        <Text style={styles.totalText}>
          Mk {formatAmount(total)}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Payment */}
      <View style={styles.section}>
        <Text>
          Payment Method:{" "}
          {paymentMethod}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          Thank you for your purchase
        </Text>

        <Text>
          Please keep this receipt
        </Text>

        {shop?.vatNumber && (
          <Text>
            VAT No: {shop.vatNumber}
          </Text>
        )}
      </View>
    </Page>
  </Document>
)

export function ReceiptPDF(
  props: ReceiptPDFProps
) {
  const shop = useShopStore(
    (state) => state.shop
  )

  const hasItems =
    props.items &&
    props.items.length > 0

  const handlePrint = () => {
    if (!hasItems) {
      toast.error(
        "Cannot print empty receipt"
      )
      return
    }

    const printWindow = window.open(
      "",
      "_blank"
    )

    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>

          <style>
            body {
              font-family: monospace;
              width: 80mm;
              margin: 0 auto;
              padding: 10px;
              font-size: 12px;
            }

            .center {
              text-align: center;
            }

            .divider {
              border-top: 1px dashed black;
              margin: 8px 0;
            }

            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              gap: 10px;
            }

            .left {
              width: 70%;
            }

            .right {
              width: 30%;
              text-align: right;
            }

            .total {
              font-weight: bold;
              font-size: 14px;
            }

            @media print {
              body {
                width: 80mm;
              }

              @page {
                margin: 0;
              }
            }
          </style>
        </head>

        <body>

          <div class="center">
            <h3>
              ${shop?.name || "TECAM SMS"}
            </h3>

            ${
              shop?.address
                ? `<div>${shop.address}</div>`
                : ""
            }

            ${
              shop?.phone
                ? `<div>${shop.phone}</div>`
                : ""
            }

            ${
              shop?.email
                ? `<div>${shop.email}</div>`
                : ""
            }

            <div>
              Receipt #${props.transactionId}
            </div>

            <div>
              ${new Date().toLocaleString()}
            </div>
          </div>

          <div class="divider"></div>

          ${
            props.customerInfo?.name
              ? `
              <div>
                Customer:
                ${props.customerInfo.name}
              </div>
            `
              : ""
          }

          ${
            props.customerInfo?.phone
              ? `
              <div>
                Phone:
                ${props.customerInfo.phone}
              </div>
            `
              : ""
          }

          ${
            props.customerInfo?.email
              ? `
              <div>
                Email:
                ${props.customerInfo.email}
              </div>
            `
              : ""
          }

          ${
            props.customerInfo?.name ||
            props.customerInfo?.phone ||
            props.customerInfo?.email
              ? `<div class="divider"></div>`
              : ""
          }

          ${props.items
            .map(
              (item) => `
                <div class="row">
                  <div class="left">
                    ${item.name}<br />
                    ${item.quantity} × Mk ${formatAmount(
                      item.price
                    )}
                  </div>

                  <div class="right">
                    Mk ${formatAmount(
                      item.price *
                        item.quantity
                    )}
                  </div>
                </div>
              `
            )
            .join("")}

          <div class="divider"></div>

          <div class="row">
            <span>Subtotal</span>

            <span>
              Mk ${formatAmount(
                props.subtotal
              )}
            </span>
          </div>

          <div class="row">
            <span>VAT</span>

            <span>
              Mk ${formatAmount(props.tax)}
            </span>
          </div>

          <div class="row total">
            <span>TOTAL</span>

            <span>
              Mk ${formatAmount(props.total)}
            </span>
          </div>

          <div class="divider"></div>

          <div>
            Payment:
            ${props.paymentMethod}
          </div>

          ${
            shop?.vatNumber
              ? `
              <div>
                VAT No:
                ${shop.vatNumber}
              </div>
            `
              : ""
          }

          <div
            class="center"
            style="margin-top: 20px;"
          >
            Thank you for your purchase
          </div>

          <script>
            window.onload = function () {
              window.print()

              window.onafterprint =
                function () {
                  window.close()
                }
            }
          </script>

        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <div className="flex gap-2">
      <PDFDownloadLink
        document={
          <ReceiptDocument
            {...props}
            shop={shop}
          />
        }
        fileName={`receipt-${props.transactionId}.pdf`}
      >
        {({ loading }) => (
          <Button
            variant="outline"
            disabled={
              loading || !hasItems
            }
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />

            {loading
              ? "Generating..."
              : "Download PDF"}
          </Button>
        )}
      </PDFDownloadLink>

      <Button
        onClick={handlePrint}
        disabled={!hasItems}
        className="flex-1"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Receipt
      </Button>
    </div>
  )
}