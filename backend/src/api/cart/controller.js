import { Cart } from "@/api/cart/schema/model";
import { Product } from "@/api/product/schema/model";
import { logNames } from "@/lib/logger/helper";
import { mainLogger } from "@/lib/logger/winston";
import { createErrorResponse } from "@/lib/services/error";
import { createSuccessResponse } from "@/lib/services/success";
import { handleError } from "@/lib/utils/error-handle";
import { StatusCodes } from "http-status-codes";

export const addToCart = async (req, res) => {  try {    const { userId, productId, quantity, size, color } = req.body;
    if (!userId || !productId || !quantity || quantity <= 0) {
      return createErrorResponse(res, "Invalid data provided!", StatusCodes.BAD_REQUEST);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return createErrorResponse(res, "Product not found!", StatusCodes.NOT_FOUND);
    }

    let availableStock;

    if (product.variants && product.variants.length > 0) {
      const matchingVariants = product.variants.filter(v => 
        (!size || v.size === size) && (!color || v.color === color)
      );

      if (matchingVariants.length === 0) {
        return createErrorResponse(res, "Selected variant is not available!", StatusCodes.BAD_REQUEST);
      }
    
      availableStock = matchingVariants.reduce((total, v) => total + v.stock, 0);
    } else {
      availableStock = product.totalStock;
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && 
        (!size || item.size === size) && 
        (!color || item.color === color)
    );

    if (existingItemIndex !== -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantity > availableStock) {
        return createErrorResponse(
          res,
          `Only ${availableStock - cart.items[existingItemIndex].quantity} more items can be added!`,
          StatusCodes.BAD_REQUEST
        );
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      if (quantity > availableStock) {
        return createErrorResponse(res, `Only ${availableStock} items available!`, StatusCodes.BAD_REQUEST);
      }
      cart.items.push({ 
        productId, 
        quantity, 
        ...(size && { size }), 
        ...(color && { color })
      });
    }    await cart.save();
    createSuccessResponse(res, cart, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const fetchUserCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return createErrorResponse(res, "User id is mandatory", StatusCodes.BAD_REQUEST);
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images name price salePrice",
    });

    if (!cart) {
      return createErrorResponse(res, "Cart not found!", StatusCodes.NOT_FOUND);
    }

    const validItems = cart.items.filter((productItem) => productItem.productId);

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      images: item.productId.images,
      name: item.productId.name,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    createSuccessResponse(res, { ...cart._doc, items: populateCartItems }, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, size, color, quantity } = req.body;    if (!userId || !productId || quantity <= 0) {
      return createErrorResponse(res, "Invalid data provided!", StatusCodes.BAD_REQUEST);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return createErrorResponse(res, "Product not found!", StatusCodes.NOT_FOUND);
    }    let availableStock;
    if (product.variants && product.variants.length > 0) {
      const matchingVariants = product.variants.filter(v => 
        (!size || v.size === size) && (!color || v.color === color)
      );
      if (matchingVariants.length === 0) {
        return createErrorResponse(res, "Selected variant not found!", StatusCodes.NOT_FOUND);
      }
      availableStock = matchingVariants.reduce((total, v) => total + v.stock, 0);
    } else {
      availableStock = product.totalStock;
    }

    if (quantity > availableStock) {
      return createErrorResponse(res, `Only ${availableStock} items available!`, StatusCodes.BAD_REQUEST);
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return createErrorResponse(res, "Cart not found!", StatusCodes.NOT_FOUND);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size && item.color === color
    );

    if (itemIndex === -1) {
      return createErrorResponse(res, "Cart item not present!", StatusCodes.NOT_FOUND);
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images name price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      images: item.productId ? item.productId.images : null,
      name: item.productId ? item.productId.name : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    createSuccessResponse(res, { ...cart._doc, items: populateCartItems }, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteCartItem = async (req, res) => {
  try {    const { userId, productId, size, color } = req.body;
    if (!userId || !productId) {
      return createErrorResponse(res, "Invalid data provided!", StatusCodes.BAD_REQUEST);
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return createErrorResponse(res, "Cart not found!", StatusCodes.NOT_FOUND);
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && 
        (!size || item.size === size) && 
        (!color || item.color === color))
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images name price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      images: item.productId ? item.productId.images : null,
      name: item.productId ? item.productId.name : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    createSuccessResponse(res, { ...cart._doc, items: populateCartItems }, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};