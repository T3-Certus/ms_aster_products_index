import {
  GlobalProductModel,
  IndividualProductModel,
  ProductCategoryModel,
  ProductCollectionModel,
  ProductColorModel,
  ProductMaterialModel,
  ProductSeasonModel,
  ProductSizeModel,
} from "../model";
import {
  GenericServiceErrorResponse,
  GenericServiceResponse,
} from "../utils/interfaces/responses";
import {
  status200Ok,
  status201Created,
  status400BadRequest,
  status404NotFound,
  status500InternalServerError,
} from "../utils/methods/httpResponses";
import { requestGetParamsValidator } from "../utils/methods";
import { Request, Response } from "express";
import { getGenericResponseHelper } from "../utils/methods/responseHelpers";

const globalProductModel = GlobalProductModel;

const getValidator = requestGetParamsValidator;
const resourceName = "global_products";

export async function getGlobalProducts(
  req: any,
  res: Response<GenericServiceResponse | GenericServiceErrorResponse>
) {
  const query = req.query;
  const attributes = [
    "id_global_product",
    "id_product_collection",
    "id_product_season",
    "id_product_material",
    "id_product_category",
    "product_url_code",
    "product_name",
  ];

  try {
    const globalProducts = await globalProductModel.findAll({
      attributes: [
        "id_global_product",
        // "id_product_collection",
        // "id_product_season",
        // "id_product_material",
        // "id_product_category",
        "product_url_code",
        "product_name",
      ],
      include: [
        {
          model: IndividualProductModel,
          include: [
            {
              model: ProductSizeModel,
              attributes: [
                ["id_product_size", "id"],
                ["product_size_name", "name"],
              ],
            },
            {
              model: ProductColorModel,
              attributes: [
                ["id_product_color", "id"],
                ["product_color_name", "name"],
              ],
            },
          ],
        },
        {
          model: ProductCollectionModel,
          attributes: [
            ["id_product_collection", "id"],
            ["product_collection_name", "name"],
          ],
        },
        {
          model: ProductSeasonModel,
          attributes: [
            ["id_product_season", "id"],
            ["product_season_name", "name"],
          ],
        },
        {
          model: ProductMaterialModel,
          attributes: [
            ["id_product_material", "id"],
            ["product_material_name", "name"],
          ],
        },
        {
          model: ProductCategoryModel,
          attributes: [
            ["id_product_category", "id"],
            ["product_category_name", "name"],
          ],
        },
      ],
      where: getValidator(query, attributes),
    });

    getGenericResponseHelper(globalProducts, resourceName, res);
  } catch (error) {
    return res.status(500).json(status500InternalServerError(`${error}`));
  }
}

export async function getIndividualProducts(
  req: any,
  res: Response<GenericServiceResponse | GenericServiceErrorResponse>
) {
  const { idGlobal, idIndividual } = req.params;

  try {
    const individualProducts = await IndividualProductModel.findAll({
      attributes: [
        "id_individual_product",
        "id_global_product",
        // "id_product_size",
        // "id_product_color",
        "product_stock",
        "product_price",
        "product_sku",
        "product_url_img",
        "has_offer",
        "percent_discount",
      ],
      where:
        idGlobal && idIndividual
          ? { id_global_product: idGlobal, id_individual_product: idIndividual }
          : idGlobal && !idIndividual
          ? { id_global_product: idGlobal }
          : {},
      include: [
        {
          model: ProductSizeModel,
          attributes: [
            ["id_product_size", "id"],
            ["product_size_name", "name"],
          ],
        },
        {
          model: ProductColorModel,
          attributes: [
            ["id_product_color", "id"],
            ["product_color_name", "name"],
          ],
        },
      ],
    });

    getGenericResponseHelper(individualProducts, "individual_products", res);
  } catch (error) {
    return res.status(500).json(status500InternalServerError(`${error}`));
  }
}
