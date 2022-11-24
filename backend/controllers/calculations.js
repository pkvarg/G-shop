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
  paymentMethod: 'Cash',
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

// // itemsInfo in oneArray
// let oneOrderArray = []
// const loop = createdOrder.orderItems
// const theThing = loop.forEach((item) => {
//   for (let key in item) {
//     //console.log(`${key}: ${mobile[key]}`)
//     oneOrderArray.push(`${key}: ${item[key]}`)
//   }
// })

// let moreInfo = []
// let addressInfo = createdOrder.shippingAddress
// moreInfo.push(addressInfo)
// moreInfo.forEach((item) => {
//   for (let key in item) {
//     oneOrderArray.push(`${key}: ${item[key]}`)
//   }
// })

// const paymentMethod = createdOrder.paymentMethod
// const taxPrice = createdOrder.taxPrice
// const shippingPrice = createdOrder.shippingPrice
// const totalPrice = createdOrder.totalPrice
// const isPaid = createdOrder.isPaid
// const createdAt = createdOrder.createdAt
// const additional = {
//   paymentMethod: paymentMethod,
//   taxPrice: taxPrice,
//   shippingPrice: shippingPrice,
//   totalPrice: totalPrice,
//   isPaid: isPaid,
//   createdAt: createdAt,
// }
// let additionalArray = []
// additionalArray.push(additional)
// additionalArray.forEach((item) => {
//   for (let key in item) {
//     //console.log(`${key}: ${mobile[key]}`)
//     oneOrderArray.push(`${key}: ${item[key]}`)
//   }
// })

// console.log(oneOrderArray)
