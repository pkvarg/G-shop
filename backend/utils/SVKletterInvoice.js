// Required packages

let name = 'Peter Varga'
const createdOrder = {
  user: '637e14b1cd0e572dddbf53f0',
  orderItems: [
    {
      name: 'Logitech G-Series ľščťžýáíéäň Šú Gaming Mouse',
      qty: 1,
      image: '/images/mouse.jpg',
      price: 49.99,
      product: '635bf1b455f0356a39f0f5bc',
      _id: '637f1d7fdb4eb1211f4277f8',
    },
    {
      name: 'XXXtech G-Series Gaming Mouse',
      qty: 1,
      image: '/images/mouse.jpg',
      price: 49.99,
      product: '635bf1b455f0356a39f0f5bc',
      _id: '637f1d7fdb4eb1211f4277f8',
    },
    {
      name: 'Airpods Wireless Bluetooth Headphones',
      qty: 2,
      image: '/images/airpods.jpg',
      price: 89.99,
      product: '635bf1b455f0356a39f0f5b8',
      _id: '637f1d7fdb4eb1211f4277f9',
    },
  ],
  shippingAddress: {
    address: 'Nábrežná, 42',
    city: 'Nové Zámky',
    postalCode: '94002',
    country: 'Slovakia',
  },
  paymentMethod: 'Card',
  taxPrice: 34.5,
  shippingPrice: 0,
  totalPrice: 264.47,
  isPaid: false,
  isDelivered: false,
  _id: '637f1d7fdb4eb1211f4277f7',
  createdAt: '2022-11-24T07:30:07.856Z',
  //updatedAt: 2022-11-24T07:30:07.856Z,
  __v: 0,
}

//invoice
// HandleDate
const date = createdOrder.createdAt
let dateFromJson = new Date(date)
let day = dateFromJson.getDate()
let month = dateFromJson.getMonth() + 1
let year = dateFromJson.getFullYear()
let billingDate = `${day}/${month}/${year}`
// function to create Billing due date
function addMonths(numOfMonths, date) {
  date.setMonth(date.getMonth() + numOfMonths)
  // return Real DMY
  let increasedDay = date.getDate()
  let increasedMonth = date.getMonth() + 1
  let increasedYear = date.getFullYear()
  let increasedDMY = `${increasedDay}/${increasedMonth}/${increasedYear}`
  return increasedDMY
}

// 👇️ Add months to current Date
let dueDate = addMonths(1, dateFromJson)
console.log('dueDate:', dueDate)

const invoiceDetails = {
  shipping: {
    name: name,
    address: createdOrder.shippingAddress.address,
    city: createdOrder.shippingAddress.city,
    //state: 'Dubai',
    country: createdOrder.shippingAddress.country,
    postal_code: 94111,
  },
  items: createdOrder.orderItems,

  subtotal: 156,
  total: createdOrder.totalPrice,
  taxPrice: createdOrder.taxPrice,
  order_number: 1234222,
  header: {
    company_name: 'Prúd',
    company_logo: './prud-prud-logo.png',
    company_address: 'Špieszova 5, 84104, Bratislava, Slovensko',
  },
  ico: 'IČO: 36076589',
  dic: 'DIČ: 2022028173',
  footer: {
    text: 'Copyright',
  },
  currency_symbol: '$',
  date: {
    billing_date: billingDate,
    due_date: dueDate,
  },
}

// console.log(invoiceDetails.items)
// console.log(invoiceDetails.items.length)

const fs = require('fs')
const PDFDocument = require('pdfkit')

let niceInvoice = (invoice, path) => {
  let doc = new PDFDocument({ size: 'A4', margin: 40 })
  doc.registerFont('Cardo', './fonts/Cardo-Regular.ttf')
  doc.registerFont('Cardo-Bold', './fonts/Cardo-Bold.ttf')

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
    .text(invoice.order_number, 150, customerInformationTop)
    .fontSize(14)
    .font('Cardo')
    .text('Billing Date:', 50, customerInformationTop + 15)
    .text(invoice.date.billing_date, 150, customerInformationTop + 15)
    .text('Due Date:', 50, customerInformationTop + 30)
    .text(invoice.date.due_date, 150, customerInformationTop + 30)

    .font('Cardo-Bold')
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font('Cardo')
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city + ', ' + invoice.shipping.country,
      300,
      customerInformationTop + 30
    )
    .moveDown()

  generateHr(doc, 252)
}

let invoiceTable = (doc, invoice) => {
  let i
  const invoiceTableTop = 330
  const currencySymbol = '$'

  doc.font('Cardo-Bold')
  tableRow(doc, invoiceTableTop, 'Item', '', 'Price', 'Quantity', 'Total')
  generateHr(doc, invoiceTableTop + 20)
  doc.font('Cardo')

  //console.log('InvoiceItems: ', invoice.items.length)

  for (i = 0; i < invoice.items.length; i++) {
    let item = invoice.items[i]
    //console.log(item.price)
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
  //console.log('tax: ', tax)
  //console.log('totalPrice:', totalPrice)
  //console.log('sumTotal:', sumTotal)

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

//module.exports = niceInvoice;
niceInvoice(invoiceDetails, 'myInvoice.pdf')
