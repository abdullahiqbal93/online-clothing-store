import { Wishlist } from "@/api/wishlist/schema/model";
import { Product } from "@/api/product/schema/model";
import { createSuccessResponse } from "@/lib/services/success";
import { createErrorResponse } from "@/lib/services/error";
import { handleError } from "@/lib/utils/error-handle";
import { StatusCodes } from "http-status-codes";

export const addToWishlist = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return createErrorResponse(res, "No products to add", StatusCodes.BAD_REQUEST);
    }

    const productId = products[0]; 

    const product = await Product.findById(productId);
    if (!product) {
      return createErrorResponse(res, "Product not found", StatusCodes.NOT_FOUND);
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return createErrorResponse(res, "Product already in wishlist", StatusCodes.BAD_REQUEST);
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate("products");

    createSuccessResponse(res, wishlist, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, products } = req.body;
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return createErrorResponse(res, "Wishlist not found", StatusCodes.NOT_FOUND);
    }

    let productId= products[0]; 

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: "products",
      select: "_id name price images brand salePrice",
    });

    createSuccessResponse(res, populatedWishlist, StatusCodes.OK, "Removed from wishlist");
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "products",
      select: "_id name price images brand salePrice",
    });

    if (!wishlist) {
      return createSuccessResponse(res, { products: [] }, StatusCodes.OK);
    }

    createSuccessResponse(res, wishlist, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};