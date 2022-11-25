//import niceInvoice from 'nice-invoice'

// const invoiceDetails = {
//   user: '637e14b1cd0e572dddbf53f0',
//   orderItems: [
//     {
//       name: 'Logitech G-Series Gaming Mouse',
//       qty: 1,
//       image: '/images/mouse.jpg',
//       price: 49.99,
//       product: '635bf1b455f0356a39f0f5bc',
//       _id: '637f1d7fdb4eb1211f4277f8',
//     },
//     {
//       name: 'XXXtech G-Series Gaming Mouse',
//       qty: 1,
//       image: '/images/mouse.jpg',
//       price: 49.99,
//       product: '635bf1b455f0356a39f0f5bc',
//       _id: '637f1d7fdb4eb1211f4277f8',
//     },
//     {
//       name: 'Airpods Wireless Bluetooth Headphones',
//       qty: 2,
//       image: '/images/airpods.jpg',
//       price: 89.99,
//       product: '635bf1b455f0356a39f0f5b8',
//       _id: '637f1d7fdb4eb1211f4277f9',
//     },
//   ],
//   shippingAddress: {
//     address: 'Nábrežná, 42',
//     city: 'Nové Zámky',
//     postalCode: '94002',
//     country: 'Slovakia',
//   },
//   paymentMethod: 'Card',
//   taxPrice: 34.5,
//   shippingPrice: 0,
//   totalPrice: 264.47,
//   isPaid: false,
//   isDelivered: false,
//   _id: '637f1d7fdb4eb1211f4277f7',
//   createdAt: '2022-11-24T07:30:07.856Z',
//   //updatedAt: 2022-11-24T07:30:07.856Z,
//   __v: 0,
// }

const invoiceDetails = {
  shipping: {
    name: 'Micheal',
    address: '1234 Main Street',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    postal_code: 94111,
  },
  items: [
    {
      item: 'Chair',
      description: 'Wooden chair',
      quantity: 1,
      price: 50.0,
      tax: '10%',
    },
    {
      item: 'Watch',
      description: 'Wall watch for office',
      quantity: 2,
      price: 30.0,
      tax: '10%',
    },
    {
      item: 'Water Glass Set',
      description: 'Water glass set for office',
      quantity: 1,
      price: 35.0,
      tax: '',
    },
  ],
  subtotal: 156,
  total: 156,
  order_number: 1234222,
  header: {
    company_name: 'Prúd',
    company_logo: '/backend/utils/prud-logo.png',
    company_address:
      'Špieszova 5, 84104 Bratislava, Slovensko, E-mail: publikacie@prud.sk',
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

niceInvoice(invoiceDetails, 'myInvoice.pdf')
