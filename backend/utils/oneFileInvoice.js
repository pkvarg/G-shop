// Required packages

const createdOrder = {
  user: '637e14b1cd0e572dddbf53f0',
  orderItems: [
    {
      name: 'Logitech G-Series Gaming Mouse',
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

const invoiceDetails = {
  shipping: {
    name: 'Micheal',
    address: '1234 Main Street',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    postal_code: 94111,
  },
  items: createdOrder.orderItems,

  subtotal: 156,
  total: createdOrder.totalPrice,
  taxPrice: createdOrder.taxPrice,
  order_number: 1234222,
  header: {
    company_name: 'Cyberncode',
    company_logo: 'logo.png',
    company_address:
      'Nice Invoice. 123 William Street 1th Floor New York, NY 123456',
  },
  footer: {
    text: 'Copyright',
  },
  currency_symbol: '$',
  date: {
    billing_date: '08 August 2020',
    due_date: '10 September 2020',
  },
}

// console.log(invoiceDetails.items)
// console.log(invoiceDetails.items.length)

const fs = require('fs')
const PDFDocument = require('pdfkit')

let niceInvoice = (invoice, path) => {
  let doc = new PDFDocument({ size: 'A4', margin: 40 })

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
      .image(invoice.header.company_logo, 50, 45, { width: 50 })
      .fontSize(20)
      .text(invoice.header.company_name, 110, 57)
      .moveDown()
  } else {
    doc.fontSize(20).text(invoice.header.company_name, 50, 45).moveDown()
  }

  if (invoice.header.company_address.length !== 0) {
    companyAddress(doc, invoice.header.company_address)
  }
}

let customerInformation = (doc, invoice) => {
  doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160)

  generateHr(doc, 185)

  const customerInformationTop = 200

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(invoice.order_number, 150, customerInformationTop)
    .font('Helvetica')
    .text('Billing Date:', 50, customerInformationTop + 15)
    .text(invoice.date.billing_date, 150, customerInformationTop + 15)
    .text('Due Date:', 50, customerInformationTop + 30)
    .text(invoice.date.due_date, 150, customerInformationTop + 30)

    .font('Helvetica-Bold')
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font('Helvetica')
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city +
        ', ' +
        invoice.shipping.state +
        ', ' +
        invoice.shipping.country,
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

  doc.font('Helvetica-Bold')
  tableRow(doc, invoiceTableTop, 'Item', '', 'Price', 'Quantity', 'Total')
  generateHr(doc, invoiceTableTop + 20)
  doc.font('Helvetica')

  console.log('InvoiceItems: ', invoice.items.length)

  for (i = 0; i < invoice.items.length; i++) {
    let item = invoice.items[i]
    //console.log(item.price)
    let total = invoice.items[i].qty * invoice.items[i].price
    console.log(total)
    const position = invoiceTableTop + (i + 1) * 30
    tableRow(
      doc,
      position,
      item.name,
      item.description,
      formatCurrency(item.price, currencySymbol),
      item.qty,
      total
      //item.description,

      // item.quantity,
      // formatCurrency(
      // applyTaxIfAvailable(item.price, item.quantity, item.tax),
      //currencySymbol
    ),
      //checkIfTaxAvailable(item.tax)

      generateHr(doc, position + 20)
  }

  let tax = invoice.taxPrice
  let totalPrice = invoice.total
  let sumTotal = tax + totalPrice
  console.log('tax: ', tax)
  console.log('totalPrice:', totalPrice)
  console.log('sumTotal:', sumTotal)

  const subtotalPosition = invoiceTableTop + (i + 1) * 30
  doc.font('Helvetica-Bold')
  totalTable(
    doc,
    subtotalPosition,
    'included.tax',
    formatCurrency(tax, currencySymbol)
  )

  const paidToDatePosition = subtotalPosition + 20
  doc.font('Helvetica-Bold')
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
    .fontSize(10)
    .text(name, 400, y, { width: 90, align: 'right' })
    .text(description, 0, y, { align: 'right' })
}

let tableRow = (doc, y, item, description, price, quantity, lineTotal) => {
  doc
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 130, y)
    .text(price, 337, y, { width: 90, align: 'right' })
    .text(quantity, 392, y, { width: 90, align: 'right' })
    .text(lineTotal, 457, y, { width: 90, align: 'right' })
  //.text(tax, 10, y, { align: 'right' })
}

let generateHr = (doc, y) => {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke()
}

let formatCurrency = (cents, symbol) => {
  return symbol + cents.toFixed(2)
}

// let getNumber = (str) => {
//   if (str.length !== 0) {
//     var num = str.replace(/[^0-9]/g, '')
//   } else {
//     var num = 0
//   }

//   return num
// }

// let checkIfTaxAvailable = (tax) => {
//   let validatedTax = getNumber(tax)
//   if (
//     Number.isNaN(validatedTax) === false &&
//     validatedTax <= 100 &&
//     validatedTax > 0
//   ) {
//     var taxValue = tax
//   } else {
//     var taxValue = '---'
//   }

//   return taxValue
// }

// let applyTaxIfAvailable = (price, quantity, tax) => {
//   let validatedTax = getNumber(tax)
//   if (Number.isNaN(validatedTax) === false && validatedTax <= 100) {
//     let taxValue = '.' + validatedTax
//     var itemPrice = price * quantity * (1 + taxValue)
//   } else {
//     var itemPrice = price * quantity * (1 + taxValue)
//   }

//   return itemPrice
// }

let companyAddress = (doc, address) => {
  let str = address
  let chunks = str.match(/.{0,25}(\s|$)/g)
  let first = 50
  chunks.forEach(function (i, x) {
    doc.fontSize(10).text(chunks[x], 200, first, { align: 'right' })
    first = +first + 15
  })
}

//module.exports = niceInvoice;
niceInvoice(invoiceDetails, 'myInvoice.pdf')
// 26 nov save
// Required packages

const createdOrder = {
  user: '637e14b1cd0e572dddbf53f0',
  orderItems: [
    {
      name: 'Logitech G-Series Gaming Mouse',
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

const invoiceDetails = {
  shipping: {
    name: 'Micheal',
    address: '1234 Main Street',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
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
    ICO: 'IČO: --- ',
    DIC: 'DIČ: 2022028173',
  },
  footer: {
    text: 'Copyright',
  },
  currency_symbol: '$',
  date: {
    billing_date: '08 August 2020',
    due_date: '10 September 2020',
  },
}

console.log('ccc:', String.fromCharCode('10C'))
// console.log(invoiceDetails.items)
// console.log(invoiceDetails.items.length)

const fs = require('fs')
const PDFDocument = require('pdfkit')

let niceInvoice = (invoice, path) => {
  let doc = new PDFDocument({ size: 'A4', margin: 40 })
  doc.registerFont('Aller', './fonts/Aller_Rg.ttf', 'Aller_Rg')
  doc.text('Slovak')

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
      .fontSize(15)
      .text(invoice.header.company_name, 522, 33)
      .moveDown()
  } else {
    doc.fontSize(20).text(invoice.header.company_name, 50, 45).moveDown()
  }

  if (invoice.header.company_address.length !== 0) {
    companyAddress(doc, invoice.header.company_address)
  }
  // ico dic
  if (invoice.header.ICO.length !== 0) {
    doc.font('Times-Roman').fontSize(10).text(invoice.header.ICO, 458, 80, {
      align: 'right',
      width: 90,
    })
  }

  if (invoice.header.DIC.length !== 0) {
    doc
      .fontSize(10)
      .text(invoice.header.DIC, 456, 95, { align: 'right', width: 90 })
  }

  //console.log(invoice.header.DIC)
}

let customerInformation = (doc, invoice) => {
  doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160)

  generateHr(doc, 185)

  const customerInformationTop = 200

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(invoice.order_number, 150, customerInformationTop)
    .font('Helvetica')
    .text('Billing Date:', 50, customerInformationTop + 15)
    .text(invoice.date.billing_date, 150, customerInformationTop + 15)
    .text('Due Date:', 50, customerInformationTop + 30)
    .text(invoice.date.due_date, 150, customerInformationTop + 30)

    .font('Helvetica-Bold')
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font('Helvetica')
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city +
        ', ' +
        invoice.shipping.state +
        ', ' +
        invoice.shipping.country,
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

  doc.font('Helvetica-Bold')
  tableRow(doc, invoiceTableTop, 'Item', '', 'Price', 'Quantity', 'Total')
  generateHr(doc, invoiceTableTop + 20)
  doc.font('Helvetica')

  console.log('InvoiceItems: ', invoice.items.length)

  for (i = 0; i < invoice.items.length; i++) {
    let item = invoice.items[i]
    //console.log(item.price)
    let total = invoice.items[i].qty * invoice.items[i].price
    console.log(total)
    const position = invoiceTableTop + (i + 1) * 30
    tableRow(
      doc,
      position,
      item.name,
      item.description,
      formatCurrency(item.price, currencySymbol),
      item.qty,
      total
      //item.description,

      // item.quantity,
      // formatCurrency(
      // applyTaxIfAvailable(item.price, item.quantity, item.tax),
      //currencySymbol
    ),
      //checkIfTaxAvailable(item.tax)

      generateHr(doc, position + 20)
  }

  let tax = invoice.taxPrice
  let totalPrice = invoice.total
  let sumTotal = tax + totalPrice
  console.log('tax: ', tax)
  console.log('totalPrice:', totalPrice)
  console.log('sumTotal:', sumTotal)

  const subtotalPosition = invoiceTableTop + (i + 1) * 30
  doc.font('Helvetica-Bold')
  totalTable(
    doc,
    subtotalPosition,
    'included tax',
    formatCurrency(tax, currencySymbol)
  )

  const paidToDatePosition = subtotalPosition + 20
  doc.font('Helvetica-Bold')
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
    .fontSize(10)
    .text(name, 400, y, { width: 90, align: 'right' })
    .text(description, 500, y, { align: 'right' })
}

let tableRow = (doc, y, item, description, price, quantity, lineTotal) => {
  doc
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 130, y)
    .text(price, 337, y, { width: 90, align: 'right' })
    .text(quantity, 392, y, { width: 90, align: 'right' })
    .text(lineTotal, 467, y, { width: 90, align: 'right' })
  //.text(tax, 10, y, { align: 'right' })
}

let generateHr = (doc, y) => {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(560, y).stroke()
}

let formatCurrency = (cents, symbol) => {
  return symbol + cents.toFixed(2)
}

// let getNumber = (str) => {
//   if (str.length !== 0) {
//     var num = str.replace(/[^0-9]/g, '')
//   } else {
//     var num = 0
//   }

//   return num
// }

// let checkIfTaxAvailable = (tax) => {
//   let validatedTax = getNumber(tax)
//   if (
//     Number.isNaN(validatedTax) === false &&
//     validatedTax <= 100 &&
//     validatedTax > 0
//   ) {
//     var taxValue = tax
//   } else {
//     var taxValue = '---'
//   }

//   return taxValue
// }

// let applyTaxIfAvailable = (price, quantity, tax) => {
//   let validatedTax = getNumber(tax)
//   if (Number.isNaN(validatedTax) === false && validatedTax <= 100) {
//     let taxValue = '.' + validatedTax
//     var itemPrice = price * quantity * (1 + taxValue)
//   } else {
//     var itemPrice = price * quantity * (1 + taxValue)
//   }

//   return itemPrice
// }

let companyAddress = (doc, address) => {
  let str = address
  console.log('str: ', str)
  let chunks = str.match(/.{0,25}(\s|$)/g)
  console.log('chunks:', chunks)
  let first = 50
  chunks.forEach(function (i, x) {
    doc.fontSize(10).text(chunks[x], 200, first, { align: 'right' })
    first = +first + 15
  })
}

//module.exports = niceInvoice;
niceInvoice(invoiceDetails, 'myInvoice.pdf')
