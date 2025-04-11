import { Address } from "@/api/address/schema/model";
import { logNames } from "@/lib/logger/helper";
import { mainLogger } from "@/lib/logger/winston";
import { createErrorResponse } from "@/lib/services/error";
import { createSuccessResponse } from "@/lib/services/success";
import { handleError } from "@/lib/utils/error-handle";
import { StatusCodes } from "http-status-codes";

export const createAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body
    });

    createSuccessResponse(res, address, StatusCodes.CREATED);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params; 
    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { ...req.body },
      { new: true }
    );
    if (!address) {
      return createErrorResponse(res, { message: "Address not found" }, StatusCodes.NOT_FOUND);
    }
    createSuccessResponse(res, address, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      return createErrorResponse(res, { message: "Address not found" }, StatusCodes.NOT_FOUND);
    }
    createSuccessResponse(res, null, StatusCodes.NO_CONTENT, "Address Deleted Successfully");
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find(req.query);
    createSuccessResponse(res, addresses, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return createErrorResponse(res, { message: "Address not found" }, StatusCodes.NOT_FOUND);
    }
    createSuccessResponse(res, address, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};