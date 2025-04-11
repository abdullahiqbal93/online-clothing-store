import { Product } from "@/api/product/schema/model";
import { Order } from "@/api/order/schema/model";
import { logNames } from "@/lib/logger/helper";
import { mainLogger } from "@/lib/logger/winston";
import { createErrorResponse } from "@/lib/services/error";
import { createSuccessResponse } from "@/lib/services/success";
import { handleError } from "@/lib/utils/error-handle";
import { StatusCodes } from "http-status-codes";
import { imageUploadUtil } from "@/lib/utils/cloudinary";

export const createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return createErrorResponse(res, "At least one image is required", StatusCodes.BAD_REQUEST);
    }

    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const url = `data:${file.mimetype};base64,${b64}`;

        return await imageUploadUtil(url);
      })
    );

    const product = await Product.create({
      ...req.body,
      images: imageUrls,
    });

    createSuccessResponse(res, product, StatusCodes.CREATED);
  } catch (e) {
    console.error(e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const handleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return createErrorResponse(res, "No files uploaded", StatusCodes.BAD_REQUEST);
    }

    const uploadedImages = await Promise.all(req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const url = `data:${file.mimetype};base64,${b64}`;
      return await imageUploadUtil(url);
    }));

    createSuccessResponse(res, uploadedImages, StatusCodes.OK);
  } catch (error) {
    console.error(error);
    createErrorResponse(res, handleError(error), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "relevant" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.name = 1;
        break;
      case "title-ztoa":
        sort.name = -1;
        break;
      case "relevant":
      default:
        break;
    }    let products = Object.keys(sort).length > 0
      ? await Product.find(filters).sort(sort)
      : await Product.find(filters);

    products = products.map(product => {
      const reviews = product.reviews || [];
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.reviewValue, 0);
        product.averageRating = totalRating / reviews.length;
      } else {
        product.averageRating = 0;
      }
      return product;
    });

    createSuccessResponse(res, products, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateProduct = async (req, res) => {
  try {
    let allImages = [];

    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    if (req.files && req.files.length > 0) {
      const newImages = await Promise.all(
        req.files.map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const url = `data:${file.mimetype};base64,${b64}`;
          return await imageUploadUtil(url);
        })
      );
      allImages = [...existingImages, ...newImages];
    } else {
      allImages = existingImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: allImages,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return createErrorResponse(res, "Product not found", StatusCodes.NOT_FOUND);
    }

    createSuccessResponse(res, updatedProduct, StatusCodes.OK);
  } catch (e) {
    console.error(e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return createErrorResponse(res, "No product found", StatusCodes.NOT_FOUND);
    }

    createSuccessResponse(res, product, StatusCodes.OK, "Product Deleted Successfully");
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getProduct = async (req, res) => {
  try {
    let products = await Product.find(req.query);
    products = products.map(product => {
      const reviews = product.reviews || [];
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.reviewValue, 0);
        product.averageRating = totalRating / reviews.length;
      } else {
        product.averageRating = 0;
      }
      return product;
    });

    createSuccessResponse(res, products, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return createErrorResponse(res, "Product not found", StatusCodes.NOT_FOUND);
    }

    createSuccessResponse(res, product, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    createSuccessResponse(res, brands, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "delivered",
    });

    if (!order) {
      return createErrorResponse(
        res,
        "You can only review products you've ordered and received",
        StatusCodes.FORBIDDEN
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return createErrorResponse(res, "Product not found", StatusCodes.NOT_FOUND);
    }

    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === userId
    );

    if (existingReview) {
      return createErrorResponse(
        res,
        "You have already reviewed this product",
        StatusCodes.BAD_REQUEST
      );
    }

    product.reviews.push(req.body);

    const totalRating = product.reviews.reduce((sum, review) => sum + review.reviewValue, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();
    createSuccessResponse(res, product, StatusCodes.CREATED);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { userId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return createErrorResponse(res, "Product not found", StatusCodes.NOT_FOUND);
    }

    const reviewIndex = product.reviews.findIndex(
      (review) => review._id.toString() === reviewId && review.userId.toString() === userId
    );

    if (reviewIndex === -1) {
      return createErrorResponse(res, "Review not found or unauthorized", StatusCodes.NOT_FOUND);
    }

    product.reviews[reviewIndex] = {
      ...product.reviews[reviewIndex].toObject(),
      ...req.body,
    };

    const totalRating = product.reviews.reduce((sum, review) => sum + review.reviewValue, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();
    createSuccessResponse(res, product, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { userId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return createErrorResponse(res, "Product not found", StatusCodes.NOT_FOUND);
    }

    const reviewIndex = product.reviews.findIndex(
      (review) => review._id.toString() === reviewId && review.userId.toString() === userId
    );

    if (reviewIndex === -1) {
      return createErrorResponse(res, "Review not found or unauthorized", StatusCodes.NOT_FOUND);
    }

    product.reviews.splice(reviewIndex, 1);

    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.reviewValue, 0);
      product.averageRating = totalRating / product.reviews.length;
    } else {
      product.averageRating = 0;
    }

    await product.save();
    createSuccessResponse(res, { success: true }, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
