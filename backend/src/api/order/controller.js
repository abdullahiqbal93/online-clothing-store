import { Order } from "@/api/order/schema/model";
import { logNames } from "@/lib/logger/helper";
import { mainLogger } from "@/lib/logger/winston";
import { createErrorResponse } from "@/lib/services/error";
import { createSuccessResponse } from "@/lib/services/success";
import { handleError } from "@/lib/utils/error-handle";
import { StatusCodes } from "http-status-codes";
import { Product } from "@/api/product/schema/model";
import { Cart } from "@/api/cart/schema/model";
import paypal from "@/lib/utils/paypal";
import { env } from "@/lib/config"



export const addOrder = async (req, res) => {
  try {
    const { userId, cartId, cartItems, shippingAddress, orderStatus, paymentMethod, paymentStatus, totalAmount, paymentId, payerId } = req.body;

    const create_payment_json = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: {
        return_url: `${env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.name,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: 'USD',
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: 'USD',
            total: totalAmount.toFixed(2),
          },
          description: 'Order payment',
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error('PayPal Error:', error);
        return res.status(500).json({
          success: false,
          message: 'Error while creating PayPal payment',
        });
      }

      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems: cartItems.map(item => ({
          ...item,
          size: item.size,
          color: item.color
        })),
        shippingAddress,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        paymentId,
        payerId
      });

      await newlyCreatedOrder.save();

      const approvalURL = paymentInfo.links.find(
        (link) => link.rel === 'approval_url'
      ).href;

      res.status(201).json({
        success: true,
        approvalURL,
        orderId: newlyCreatedOrder._id,
      });
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ success: false, message: 'Some error occurred' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body
    });

    createSuccessResponse(res, order, StatusCodes.CREATED);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    createSuccessResponse(res, order, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    createSuccessResponse(res, order, StatusCodes.OK, "Order Deleted Successfully");
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find(req.query);
    createSuccessResponse(res, orders, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return createErrorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
    }
    createSuccessResponse(res, order, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};


export const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [{
        amount: {
          currency: 'USD',
          total: order.totalAmount.toFixed(2)
        }
      }]
    };

    await new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
          console.error('PayPal Execute Error:', error);
          reject(error);
          return;
        }
        resolve(payment);
      });
    });

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`
        });
      }

      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find(v =>
          (!item.size || v.size === item.size) &&
          (!item.color || v.color === item.color)
        );

        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Variant not found for ${item.name}`
          });
        }

        if (variant.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for ${item.name}`
          });
        }

        variant.stock -= item.quantity;
        product.totalStock -= item.quantity;
      } else {
        if (product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for ${item.name}`
          });
        }
        product.totalStock -= item.quantity;
      }

      await product.save();
    }
    await order.save();

    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    return createSuccessResponse(res, {
      message: 'Payment captured successfully',
      order
    }, StatusCodes.OK);
  } catch (error) {
    console.error('Payment Capture Error:', error);
    return createErrorResponse(
      res,
      error.response?.message || error.message || 'Payment capture failed',
      StatusCodes.BAD_REQUEST
    );
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return createErrorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
    }

    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return createErrorResponse(
        res,
        `Order cannot be cancelled in ${order.orderStatus} status`,
        StatusCodes.BAD_REQUEST
      );
    }

    const refundPercentage = order.orderStatus === 'pending' ? 100 : 90;
    const refundAmount = Number((order.totalAmount * (refundPercentage / 100)).toFixed(2));

    order.orderStatus = 'cancelled';
    order.paymentStatus = refundPercentage === 100 ? 'refunded' : 'partially-refunded';
    order.refundAmount = refundAmount;
    order.refundDate = new Date();

    await order.save();

    createSuccessResponse(
      res,
      {
        message: 'Order cancelled successfully',
        refundAmount,
        order: order.toObject()
      },
      StatusCodes.OK
    );

  } catch (error) {
    console.error('Order Cancellation Error:', error);
    createErrorResponse(
      res,
      error.message || "Failed to cancel order",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteOrderForUser = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return createErrorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
    }
    if (!['delivered', 'cancelled'].includes(order.orderStatus)) {
      return createErrorResponse(
        res,
        "You can only delete delivered or cancelled orders.",
        StatusCodes.BAD_REQUEST
      );
    }
    order.deletedFor.user = true;
    await order.save();
    return createSuccessResponse(res, { message: 'Order hidden successfully' }, StatusCodes.OK);
  } catch (error) {
    console.error('User Order Deletion Error:', error);
    createErrorResponse(res, error.message || "Failed to delete order", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};


export const deleteOrderForAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return createErrorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
    }
    order.deletedFor.admin = true;
    await order.save();
    return createSuccessResponse(res, { message: 'Order hidden successfully', order }, StatusCodes.OK);
  } catch (error) {
    console.error('Admin Order Deletion Error:', error);
    createErrorResponse(res, error.message || "Failed to delete order", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
