import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Email from '../utils/email.js'
import niceInvoice from '../utils/niceInvoice.js'
import path from 'path'

const __dirname = path.resolve()

// @desc Create new Order
// @desc POST /api/orders
// @access Private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  const user = req.body.user

  const name = req.body.name
  const email = req.body.email
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      name,
      email,
    })
    const createdOrder = await order.save()
    const createdOrderId = createdOrder._id
    let today = new Date()
    let currentYear = today.getFullYear()
    let currentMonth = today.getMonth() + 1
    let currentDay = today.getDate()
    let invoiceNo = `${currentYear}-${createdOrderId}`

    // array of items
    const loop = createdOrder.orderItems
    const productsCount = loop.length

    let productsObject = {}
    loop.map((item, i) => {
      productsObject[i] =
        ' ' + item.qty + ' x ' + item.name + ' $' + item.price + '  '
    })

    // object with address info
    const addressInfo = createdOrder.shippingAddress

    const additional = {
      paymentMethod: createdOrder.paymentMethod,
      taxPrice: createdOrder.taxPrice,
      shippingPrice: createdOrder.shippingPrice,
      totalPrice: createdOrder.totalPrice,
      isPaid: createdOrder.isPaid,
      createdAt: createdOrder.createdAt,
    }
    // ADD THESE LATER
    productsObject.user = user
    productsObject.email = email
    productsObject.name = name
    productsObject.taxPrice = additional.taxPrice
    productsObject.totalPrice = additional.totalPrice
    productsObject.shippingPrice = additional.shippingPrice
    productsObject.isPaid = additional.isPaid
    productsObject.productsCount = productsCount
    productsObject.orderId = createdOrder._id
    productsObject.paymentMethod = additional.paymentMethod
    productsObject.addressinfo =
      addressInfo.address +
      ', ' +
      addressInfo.city +
      ', ' +
      addressInfo.postalCode +
      ', ' +
      addressInfo.country

    //await new Email(productsObject).sendOrderToEmail()

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
    const dueDate = addMonths(1, dateFromJson)

    const invoiceDetails = {
      shipping: {
        name: name,
        address: createdOrder.shippingAddress.address,
        city: createdOrder.shippingAddress.city,
        country: createdOrder.shippingAddress.country,
        postal_code: 94111,
      },
      items: createdOrder.orderItems,
      invoiceNo: invoiceNo,
      paymentMethod: createdOrder.paymentMethod,

      total: createdOrder.totalPrice,
      taxPrice: createdOrder.taxPrice,
      order_number: 1234222,
      header: {
        company_name: 'Prúd',
        company_logo: __dirname + '/backend/utils/prud-prud-logo.png',
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

    niceInvoice(invoiceDetails, `${invoiceNo}.pdf`)
    const fileTosend = `${invoiceNo}.pdf`

    await new Email(productsObject, '', fileTosend).sendOrderToEmail()

    res.status(201).json(createdOrder)
  }
})

// @desc Get order by ID
// @desc GET /api/orders/:id
// @access Private

const getOrderByid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc Update order to Paid
// @desc GET /api/orders/:id/pay
// @access Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
      address: req.body.payer.address,
      name: req.body.payer.name,
    }

    const updatedOrder = await order.save()
    // send PaymentSuccessfull Email
    const updatedOrderLoop = updatedOrder.orderItems
    const updatedOrderProductsCount = updatedOrderLoop.length

    let updatedOrderProductsObject = {}
    updatedOrderLoop.map((item, i) => {
      updatedOrderProductsObject[i] =
        item.qty + ' x ' + item.name + ' price $' + item.price
    })

    // object with address info
    const updatedOrderAddressInfo = updatedOrder.shippingAddress
    const updatedOrderAdditional = {
      paymentMethod: updatedOrder.paymentMethod,
      taxPrice: updatedOrder.taxPrice,
      shippingPrice: updatedOrder.shippingPrice,
      totalPrice: updatedOrder.totalPrice,
      isPaid: updatedOrder.isPaid,
      createdAt: updatedOrder.createdAt,
    }

    // ADD THESE LATER
    updatedOrderProductsObject.email = updatedOrder.email
    updatedOrderProductsObject.name = updatedOrder.name
    updatedOrderProductsObject.paidByWhom =
      updatedOrder.paymentResult.name.given_name +
      ' ' +
      updatedOrder.paymentResult.name.surname
    updatedOrderProductsObject.taxPrice = updatedOrderAdditional.taxPrice
    updatedOrderProductsObject.totalPrice = updatedOrderAdditional.totalPrice
    updatedOrderProductsObject.shippingPrice =
      updatedOrderAdditional.shippingPrice
    updatedOrderProductsObject.isPaid = updatedOrderAdditional.isPaid
    updatedOrderProductsObject.productsCount = updatedOrderProductsCount
    updatedOrderProductsObject.orderId = updatedOrder._id
    updatedOrderProductsObject.paymentMethod =
      updatedOrderAdditional.paymentMethod
    updatedOrderProductsObject.addressinfo =
      updatedOrderAddressInfo.address +
      ' ,' +
      updatedOrderAddressInfo.city +
      ' ' +
      updatedOrderAddressInfo.postalCode +
      ' ' +
      updatedOrderAddressInfo.country

    await new Email(updatedOrderProductsObject).sendPaymentSuccessfullToEmail()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc Update order to Delivered
// @desc GET /api/orders/:id/deliver
// @access Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc Get logged in user orders
// @desc GET /api/orders/myorders
// @access Private

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc Get all orders
// @desc GET /api/orders
// @access Private/Admin

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

// DELETE ORDER
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndDelete({ _id: req.params.id })

  if (order) {
    res.json({ message: 'order deleted' })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export {
  addOrderItems,
  getOrderByid,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder,
}
