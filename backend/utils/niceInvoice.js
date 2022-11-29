import fs from 'fs'
import PDFDocument from 'pdfkit'
import path from 'path'
const __dirname = path.resolve()

const niceInvoice = (invoice, path) => {
  let doc = new PDFDocument({ size: 'A4', margin: 40 })

  doc.registerFont(
    'Cardo',
    __dirname + '/backend/utils/fonts/Cardo-Regular.ttf'
  )
  doc.registerFont(
    'Cardo-Bold',
    __dirname + '/backend/utils/fonts/Cardo-Bold.ttf'
  )

  header(doc, invoice)
  customerInformation(doc, invoice)
  invoiceTable(doc, invoice)
  footer(doc, invoice)

  doc.end()
  doc.pipe(fs.createWriteStream(path))
}

let header = (doc, invoice) => {
  if (fs.existsSync(invoice.header.company_logo)) {
    doc
      .image(invoice.header.company_logo, 50, 45, { width: 100 })
      .fontSize(18)
      .font('Cardo-Bold')
      .text(invoice.header.company_name, 515, 33)
      .moveDown()
  } else {
    doc.fontSize(18).font('Cardo-Bold')
    text(invoice.header.company_name, 515, 33).moveDown()
  }

  if (invoice.header.company_address.length !== 0) {
    companyAddress(doc, invoice.header.company_address)
  }
  // ico dic
  if (invoice.ico.length !== 0) {
    doc.font('Cardo-Bold').fontSize(15).text(invoice.ico, 454, 85)
  }
  if (invoice.dic.length !== 0) {
    doc.font('Cardo-Bold').fontSize(15).text(invoice.dic, 439.5, 105)
  }
}

let customerInformation = (doc, invoice) => {
  doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160)

  generateHr(doc, 185)

  const customerInformationTop = 200

  doc
    .fontSize(12.5)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Cardo-Bold')
    .text(invoice.invoiceNo, 160, customerInformationTop)
    .fontSize(14)
    .font('Cardo')
    .text('Billing Date:', 50, customerInformationTop + 15)
    .text(invoice.date.billing_date, 276, customerInformationTop + 15)
    .text('Due Date:', 50, customerInformationTop + 30)
    .text(invoice.date.due_date, 276, customerInformationTop + 30)
    //
    .text('Payment Method:', 50, customerInformationTop + 45)
    .text(invoice.paymentMethod, 160, customerInformationTop + 45)

    .font('Cardo-Bold')
    .text(invoice.shipping.name, 360, customerInformationTop)
    .font('Cardo')
    .text(invoice.shipping.address, 360, customerInformationTop + 15)
    .text(
      invoice.shipping.city + ', ' + invoice.shipping.country,
      360,
      customerInformationTop + 30
    )
    .moveDown()

  generateHr(doc, 272)
}

let invoiceTable = (doc, invoice) => {
  let i
  const invoiceTableTop = 330
  const currencySymbol = '$'

  doc.font('Cardo-Bold')
  tableRow(doc, invoiceTableTop, 'Item', '', 'Price', 'Quantity', 'Total')
  generateHr(doc, invoiceTableTop + 20)
  doc.font('Cardo')

  for (i = 0; i < invoice.items.length; i++) {
    let item = invoice.items[i]
    let total = invoice.items[i].qty * invoice.items[i].price
    const position = invoiceTableTop + (i + 1) * 30
    tableRow(
      doc,
      position,
      item.name,
      item.description,
      formatCurrency(item.price, currencySymbol),
      item.qty,
      total
    ),
      generateHr(doc, position + 20)
  }

  let tax = invoice.taxPrice
  let totalPrice = invoice.total
  let sumTotal = tax + totalPrice

  const subtotalPosition = invoiceTableTop + (i + 1) * 30
  doc.font('Cardo-Bold')
  totalTable(
    doc,
    subtotalPosition,
    'included tax',
    formatCurrency(tax, currencySymbol)
  )

  const paidToDatePosition = subtotalPosition + 20
  doc.font('Cardo-Bold')
  totalTable(
    doc,
    paidToDatePosition,
    'Total',
    formatCurrency(sumTotal, currencySymbol)
  )
}

let footer = (doc, invoice) => {
  if (invoice.footer.text.length !== 0) {
    doc
      .fontSize(10)
      .text(invoice.footer.text, 50, 780, { align: 'center', width: 500 })
  }
}

let totalTable = (doc, y, name, description) => {
  doc
    .fontSize(15)
    .text(name, 400, y, { width: 90, align: 'right' })
    .text(description, 500, y, { align: 'right' })
}

let tableRow = (doc, y, item, description, price, quantity, lineTotal) => {
  doc
  doc
    .fontSize(12.5)
    .text(item, 50, y)
    .text(description, 130, y)
    .text(price, 337, y, { width: 90, align: 'right' })
    .text(quantity, 402, y, { width: 90, align: 'right' })
    .text(lineTotal, 467, y, { width: 90, align: 'right' })
  //.text(tax, 10, y, { align: 'right' })
}

let generateHr = (doc, y) => {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(560, y).stroke()
}

let formatCurrency = (cents, symbol) => {
  return symbol + cents.toFixed(2)
}

let companyAddress = (doc, address) => {
  let str = address
  let chunks = str.match(/.{0,25}(\s|$)/g)
  let first = 50
  chunks.forEach(function (i, x) {
    doc.fontSize(15).text(chunks[x], 200, first, { align: 'right' })
    first = +first + 15
  })
}

export default niceInvoice
