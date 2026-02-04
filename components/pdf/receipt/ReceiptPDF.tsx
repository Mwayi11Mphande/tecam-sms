"use client"

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { Printer, Download, ShoppingBag, Wrench, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

// Types for products
interface ProductItem {
  id: number
  name: string
  price: number
  quantity: number
  total: number
}

// Types for services
interface ServiceItem {
  id: string
  description: string
  category: string
  quantity: number
  unitPrice: number
  total: number
  serviceId?: string
  notes?: string
  status?: 'pending' | 'completed' | 'invoiced'
}

// Updated props interface
interface ReceiptPDFProps {
  items?: ProductItem[]
  services?: ServiceItem[]
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
  receiptType?: 'sale' | 'service' | 'mixed'
}

// Create styles with colors
const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 10,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    textAlign: 'center',
    opacity: 0.1,
    transform: 'rotate(-45deg)',
  },
  watermarkText: {
    fontSize: 48,
    color: '#f97316',
    fontWeight: 'bold',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    borderBottom: '2px solid #3b82f6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 2,
    color: '#64748b',
  },
  receiptNumber: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '4px 8px',
    borderRadius: 4,
    marginTop: 5,
    fontSize: 9,
  },
  receiptType: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 9,
    marginLeft: 5,
  },
  section: {
    marginBottom: 10,
  },
  customerSection: {
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 6,
    borderLeft: '4px solid #3b82f6',
    marginBottom: 10,
  },
  customerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1e40af',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  colItem: {
    width: '50%',
    color: '#334155',
  },
  colQty: {
    width: '15%',
    textAlign: 'center',
    color: '#334155',
  },
  colPrice: {
    width: '20%',
    textAlign: 'right',
    color: '#334155',
  },
  colTotal: {
    width: '15%',
    textAlign: 'right',
    color: '#334155',
  },
  colDesc: {
    width: '40%',
    color: '#334155',
  },
  colCategory: {
    width: '25%',
    color: '#334155',
  },
  headerRow: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 5,
  },
  itemRow: {
    paddingVertical: 3,
    borderBottom: '1px solid #e2e8f0',
  },
  serviceItemRow: {
    paddingVertical: 3,
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#faf5ff',
  },
  totalRow: {
    marginTop: 15,
    paddingTop: 10,
    borderTop: '2px solid #f59e0b',
    backgroundColor: '#fffbeb',
    padding: 10,
    borderRadius: 6,
  },
  paymentSection: {
    backgroundColor: '#dbeafe',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    borderLeft: '4px solid #1d4ed8',
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#64748b',
    borderTop: '1px dashed #cbd5e1',
    paddingTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  orangeText: {
    color: '#f97316',
  },
  blueText: {
    color: '#1e40af',
  },
  purpleText: {
    color: '#8b5cf6',
  },
  centered: {
    textAlign: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    paddingBottom: 3,
    borderBottom: '1px solid #e2e8f0',
  },
  serviceNotes: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  serviceId: {
    fontSize: 8,
    color: '#8b5cf6',
    backgroundColor: '#f3f4f6',
    padding: '1px 3px',
    borderRadius: 2,
    marginRight: 4,
  }
})

// Format amount helper
const formatAmount = (amount: number) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Get receipt type display
const getReceiptType = (items: ProductItem[] = [], services: ServiceItem[] = []) => {
  if (items.length > 0 && services.length > 0) return 'MIXED SALE'
  if (items.length > 0) return 'PRODUCT SALE'
  if (services.length > 0) return 'SERVICE INVOICE'
  return 'RECEIPT'
}

// PDF Document Component
const ReceiptDocument = ({ 
  items = [], 
  services = [], 
  subtotal, 
  tax, 
  total, 
  paymentMethod, 
  transactionId, 
  customerInfo 
}: ReceiptPDFProps) => {
  const receiptType = getReceiptType(items, services)
  
  return (
    <Document>
      <Page size="A7" style={styles.page}>
        {/* Watermark */}
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>TECH STORE</Text>
        </View>

        {/* Header with logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={[styles.title, { marginRight: 5 }]}>🛒</Text>
            <Text style={styles.title}>TECH STORE MW</Text>
          </View>
          <Text style={styles.subtitle}>Blantyre, Malawi</Text>
          <Text style={styles.subtitle}>+265 881 234 567 | techstore.mw</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.receiptNumber}>RECEIPT #{transactionId}</Text>
            <Text style={styles.receiptType}>{receiptType}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.blueText}>Date: {new Date().toLocaleString('en-MW')}</Text>
          <Text style={styles.blueText}>Cashier: System</Text>
        </View>

        {/* Customer Info */}
        {(customerInfo?.name || customerInfo?.phone || customerInfo?.email) && (
          <View style={styles.customerSection}>
            <Text style={styles.customerTitle}>👤 CUSTOMER INFORMATION</Text>
            {customerInfo.name && (
              <View style={styles.row}>
                <Text style={{ width: '25%', color: '#475569' }}>Name:</Text>
                <Text style={{ width: '75%', fontWeight: 'bold' }}>{customerInfo.name}</Text>
              </View>
            )}
            {customerInfo.phone && (
              <View style={styles.row}>
                <Text style={{ width: '25%', color: '#475569' }}>Phone:</Text>
                <Text style={{ width: '75%' }}>{customerInfo.phone}</Text>
              </View>
            )}
            {customerInfo.email && (
              <View style={styles.row}>
                <Text style={{ width: '25%', color: '#475569' }}>Email:</Text>
                <Text style={{ width: '75%' }}>{customerInfo.email}</Text>
              </View>
            )}
          </View>
        )}

        {/* Products Section */}
        {items.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.blueText]}>🛍️ PRODUCTS</Text>
            <View style={[styles.row, styles.bold, styles.headerRow]}>
              <Text style={[styles.colItem, styles.blueText]}>PRODUCT</Text>
              <Text style={[styles.colQty, styles.blueText]}>QTY</Text>
              <Text style={[styles.colPrice, styles.blueText]}>PRICE</Text>
              <Text style={[styles.colTotal, styles.blueText]}>TOTAL</Text>
            </View>

            {/* Product Items */}
            {items.map((item, index) => (
              <View key={index} style={[styles.row, styles.itemRow]}>
                <Text style={styles.colItem}>{item.name}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>Mk {formatAmount(item.price)}</Text>
                <Text style={[styles.colTotal, styles.bold]}>Mk {formatAmount(item.total)}</Text>
              </View>
            ))}
          </>
        )}

        {/* Services Section */}
        {services.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.purpleText]}>🔧 SERVICES</Text>
            <View style={[styles.row, styles.bold, styles.headerRow]}>
              <Text style={[styles.colDesc, styles.purpleText]}>SERVICE DESCRIPTION</Text>
              <Text style={[styles.colCategory, styles.purpleText]}>CATEGORY</Text>
              <Text style={[styles.colQty, styles.purpleText]}>QTY</Text>
              <Text style={[styles.colTotal, styles.purpleText]}>TOTAL</Text>
            </View>

            {/* Service Items */}
            {services.map((service, index) => (
              <View key={index} style={[styles.row, styles.serviceItemRow]}>
                <View style={{ width: '40%' }}>
                  <Text style={styles.bold}>
                    {service.serviceId && (
                      <Text style={styles.serviceId}>#{service.serviceId}</Text>
                    )}
                    {service.description}
                  </Text>
                  {service.notes && (
                    <Text style={styles.serviceNotes}>{service.notes}</Text>
                  )}
                </View>
                <Text style={styles.colCategory}>{service.category}</Text>
                <Text style={styles.colQty}>{service.quantity}</Text>
                <Text style={[styles.colTotal, styles.bold]}>Mk {formatAmount(service.total)}</Text>
              </View>
            ))}
          </>
        )}

        {/* Totals */}
        <View style={styles.totalRow}>
          <View style={styles.row}>
            <Text style={[styles.colItem, { width: '70%' }]}>Subtotal:</Text>
            <Text style={[styles.colTotal, { width: '30%' }]}>Mk {formatAmount(subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.colItem, { width: '70%' }]}>Tax (8%):</Text>
            <Text style={[styles.colTotal, { width: '30%' }]}>Mk {formatAmount(tax)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 5 }]}>
            <Text style={[styles.colItem, { width: '70%', fontSize: 12, fontWeight: 'bold', color: '#dc2626' }]}>TOTAL:</Text>
            <Text style={[styles.colTotal, { width: '30%', fontSize: 12, fontWeight: 'bold', color: '#dc2626' }]}>Mk {formatAmount(total)}</Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.paymentSection}>
          <Text style={[styles.centered, styles.bold, { color: '#1e40af', marginBottom: 5 }]}>
            💳 PAYMENT INFORMATION
          </Text>
          <Text style={styles.centered}>Method: {paymentMethod.toUpperCase()}</Text>
          <Text style={[styles.centered, { color: '#059669', marginTop: 3 }]}>✓ Payment Verified</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ marginBottom: 3 }}>Thank you for your business! 🎉</Text>
          {services.length > 0 && (
            <Text style={{ marginBottom: 3, color: '#8b5cf6', fontSize: 7 }}>
              * Services may require separate service agreements
            </Text>
          )}
          <Text style={{ marginBottom: 3, color: '#dc2626', fontWeight: 'bold' }}>
            ** NO REFUNDS WITHOUT RECEIPT **
          </Text>
          <Text>For inquiries: support@techstore.mw | Call: +265 881 234 567</Text>
          <Text style={{ marginTop: 5, fontSize: 7, color: '#94a3b8' }}>
            Receipt ID: {transactionId} | VAT Reg: MW123456789
          </Text>
        </View>
      </Page>
    </Document>
  )
}

// Main Component
export function ReceiptPDF(props: ReceiptPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  // Check if we have items to print
  const hasItems = (props.items && props.items.length > 0) || (props.services && props.services.length > 0)

  const handlePrint = () => {
    if (!hasItems) {
      toast.error("Cannot print empty receipt", {
        description: "Add items or services to cart first",
        duration: 3000,
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const receiptType = getReceiptType(props.items || [], props.services || [])
      
      // Create HTML for printing
      const printWindow = window.open('', '_blank')
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Receipt ${props.transactionId}</title>
              <style>
                @media print {
                  body { margin: 0; padding: 10px; font-family: 'Courier New', monospace; }
                  @page { size: 80mm auto; margin: 0; }
                }
                body {
                  font-family: 'Courier New', monospace;
                  width: 80mm;
                  margin: 0 auto;
                  padding: 15px;
                  font-size: 12px;
                  line-height: 1.4;
                  position: relative;
                }
                
                /* Watermark */
                .watermark {
                  position: absolute;
                  top: 40%;
                  left: 10%;
                  right: 10%;
                  text-align: center;
                  opacity: 0.1;
                  transform: rotate(-45deg);
                  font-size: 36px;
                  font-weight: bold;
                  color: #f97316;
                  pointer-events: none;
                }
                
                .header { 
                  text-align: center; 
                  margin-bottom: 15px; 
                  border-bottom: 2px solid #3b82f6;
                  padding-bottom: 10px;
                }
                .title { 
                  font-size: 18px; 
                  font-weight: bold; 
                  margin-bottom: 5px; 
                  color: #1e40af;
                }
                .subtitle { 
                  font-size: 11px; 
                  margin-bottom: 2px; 
                  color: #64748b; 
                }
                .receipt-number {
                  background-color: #f59e0b;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  margin-top: 5px;
                  font-size: 10px;
                  display: inline-block;
                  margin-right: 5px;
                }
                .receipt-type {
                  background-color: #8b5cf6;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 10px;
                  display: inline-block;
                }
                
                /* Customer Info */
                .customer-info {
                  background-color: #f0f9ff;
                  padding: 8px;
                  border-radius: 6px;
                  border-left: 4px solid #3b82f6;
                  margin: 10px 0;
                }
                .customer-title {
                  font-weight: bold;
                  margin-bottom: 4px;
                  color: #1e40af;
                  font-size: 11px;
                }
                
                /* Section Titles */
                .section-title {
                  font-weight: bold;
                  margin-top: 15px;
                  margin-bottom: 5px;
                  padding-bottom: 3px;
                  border-bottom: 1px solid #e2e8f0;
                  font-size: 13px;
                }
                
                table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin: 10px 0; 
                }
                th, td { 
                  padding: 4px 2px; 
                  text-align: left; 
                }
                th { 
                  background-color: #f1f5f9;
                  border-bottom: 2px solid #3b82f6;
                  color: #1e40af;
                }
                td { 
                  border-bottom: 1px solid #e2e8f0; 
                }
                
                .service-row {
                  background-color: #faf5ff;
                }
                
                .service-id {
                  font-size: 9px;
                  color: #8b5cf6;
                  background-color: #f3f4f6;
                  padding: 1px 3px;
                  border-radius: 2px;
                  margin-right: 4px;
                }
                
                .service-notes {
                  font-size: 9px;
                  color: #6b7280;
                  font-style: italic;
                  margin-top: 2px;
                  display: block;
                }
                
                .total-row { 
                  border-top: 2px solid #f59e0b; 
                  padding-top: 10px; 
                  margin-top: 10px; 
                  background-color: #fffbeb;
                  padding: 10px;
                  border-radius: 6px;
                }
                
                .payment-section {
                  background-color: #dbeafe;
                  padding: 10px;
                  border-radius: 6px;
                  margin-top: 10px;
                  border-left: 4px solid #1d4ed8;
                  text-align: center;
                }
                
                .footer { 
                  text-align: center; 
                  margin-top: 20px; 
                  font-size: 10px; 
                  color: #64748b; 
                  border-top: 1px dashed #cbd5e1;
                  padding-top: 10px;
                }
                .bold { font-weight: bold; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .orange { color: #f97316; }
                .blue { color: #1e40af; }
                .purple { color: #8b5cf6; }
                .red { color: #dc2626; }
                .green { color: #059669; }
                
                .logo {
                  font-size: 20px;
                  margin-right: 5px;
                }
              </style>
            </head>
            <body>
              <!-- Watermark -->
              <div class="watermark">TECH STORE</div>
              
              <div class="header">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                  <span class="logo">🛒</span>
                  <div class="title">TECH STORE MW</div>
                </div>
                <div class="subtitle">Blantyre, Malawi</div>
                <div class="subtitle">+265 881 234 567 | techstore.mw</div>
                <div>
                  <span class="receipt-number">RECEIPT #${props.transactionId}</span>
                  <span class="receipt-type">${receiptType}</span>
                </div>
              </div>
              
              <div>
                <div class="blue">Date: ${new Date().toLocaleString('en-MW')}</div>
                <div class="blue">Cashier: System</div>
              </div>
              
              <!-- Customer Info -->
              ${props.customerInfo && (props.customerInfo.name || props.customerInfo.phone || props.customerInfo.email) ? `
                <div class="customer-info">
                  <div class="customer-title">👤 CUSTOMER INFORMATION</div>
                  ${props.customerInfo.name ? `<div><span style="color: #475569;">Name:</span> <strong>${props.customerInfo.name}</strong></div>` : ''}
                  ${props.customerInfo.phone ? `<div><span style="color: #475569;">Phone:</span> ${props.customerInfo.phone}</div>` : ''}
                  ${props.customerInfo.email ? `<div><span style="color: #475569;">Email:</span> ${props.customerInfo.email}</div>` : ''}
                </div>
              ` : ''}
              
              <!-- Products Section -->
              ${props.items && props.items.length > 0 ? `
                <div class="section-title blue">🛍️ PRODUCTS</div>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th class="text-center">Qty</th>
                      <th class="text-right">Price</th>
                      <th class="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${props.items.map(item => `
                      <tr>
                        <td>${item.name}</td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">Mk ${formatAmount(item.price)}</td>
                        <td class="text-right bold">Mk ${formatAmount(item.total)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : ''}
              
              <!-- Services Section -->
              ${props.services && props.services.length > 0 ? `
                <div class="section-title purple">🔧 SERVICES</div>
                <table>
                  <thead>
                    <tr>
                      <th>Service Description</th>
                      <th>Category</th>
                      <th class="text-center">Qty</th>
                      <th class="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${props.services.map(service => `
                      <tr class="service-row">
                        <td>
                          ${service.serviceId ? `<span class="service-id">#${service.serviceId}</span>` : ''}
                          ${service.description}
                          ${service.notes ? `<span class="service-notes">${service.notes}</span>` : ''}
                        </td>
                        <td>${service.category}</td>
                        <td class="text-center">${service.quantity}</td>
                        <td class="text-right bold">Mk ${formatAmount(service.total)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : ''}
              
              <div class="total-row">
                <div style="display: flex; justify-content: space-between;">
                  <span>Subtotal:</span>
                  <span>Mk ${formatAmount(props.subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Tax (8%):</span>
                  <span>Mk ${formatAmount(props.tax)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 8px;" class="red">
                  <span>TOTAL:</span>
                  <span>Mk ${formatAmount(props.total)}</span>
                </div>
              </div>
              
              <div class="payment-section">
                <div class="bold blue" style="margin-bottom: 5px;">💳 PAYMENT INFORMATION</div>
                <div>Method: ${props.paymentMethod.toUpperCase()}</div>
                <div class="green" style="margin-top: 3px;">✓ Payment Verified</div>
              </div>
              
              <div class="footer">
                <div style="margin-bottom: 3px;">Thank you for your business! 🎉</div>
                ${props.services && props.services.length > 0 ? `
                  <div style="margin-bottom: 3px; color: #8b5cf6; font-size: 9px;">
                    * Services may require separate service agreements
                  </div>
                ` : ''}
                <div style="margin-bottom: 3px; color: #dc2626; font-weight: bold;">
                  ** NO REFUNDS WITHOUT RECEIPT **
                </div>
                <div>For inquiries: support@techstore.mw | Call: +265 881 234 567</div>
                <div style="margin-top: 5px; font-size: 9px; color: #94a3b8;">
                  Receipt ID: ${props.transactionId} | VAT Reg: MW123456789
                </div>
              </div>
              
              <script>
                // Auto print after page loads
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    window.onafterprint = function() {
                      setTimeout(() => window.close(), 500);
                    };
                  }, 500);
                };
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
      
      toast.info("Opening print preview...", {
        description: "Print dialog will appear shortly",
        duration: 3000,
      })
      
    } catch (error) {
      console.error("Print error:", error)
      toast.error("Failed to open print dialog", {
        description: "Please try again or use Download PDF",
        duration: 3000,
      })
    } finally {
      setTimeout(() => setIsGenerating(false), 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {/* Download Button */}
        <PDFDownloadLink
          document={
            <ReceiptDocument
              items={props.items}
              services={props.services}
              subtotal={props.subtotal}
              tax={props.tax}
              total={props.total}
              paymentMethod={props.paymentMethod}
              transactionId={props.transactionId}
              customerInfo={props.customerInfo}
            />
          }
          fileName={`${getReceiptType(props.items || [], props.services || []).toLowerCase().replace(' ', '-')}-${props.transactionId}.pdf`}
        >
          {({ loading, error }) => (
            <Button
              disabled={loading || isGenerating || !hasItems}
              className="flex-1"
              variant="outline"
              onClick={() => {
                if (!loading && !error) {
                  const receiptType = getReceiptType(props.items || [], props.services || [])
                  toast.success("Downloading receipt...", {
                    description: `${receiptType} PDF has been generated`,
                    duration: 2000,
                  })
                }
              }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
        
        {/* Print Button */}
        <Button
          onClick={handlePrint}
          disabled={isGenerating || !hasItems}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </>
          )}
        </Button>
      </div>
      
      {/* Receipt Type Indicator */}
      {hasItems && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          {props.items && props.items.length > 0 && (
            <div className="flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              <span>{props.items.length} products</span>
            </div>
          )}
          {props.services && props.services.length > 0 && (
            <div className="flex items-center gap-1">
              <Wrench className="h-3 w-3" />
              <span>{props.services.length} services</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-2">
            <Layers className="h-3 w-3" />
            <span>{getReceiptType(props.items || [], props.services || [])}</span>
          </div>
        </div>
      )}
    </div>
  )
}