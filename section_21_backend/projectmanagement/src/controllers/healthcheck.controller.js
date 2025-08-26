import { ApiResponse } from "../utils/api-response.js";

const healthCheck = async (req, res, next) => {
  try {
    const user = await getUserFromDB();
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is up and running" }));
  } catch (error) {
    next(error);
  }
};

export { healthCheck };
