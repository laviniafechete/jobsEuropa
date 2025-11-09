import User from "../models/User.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";

export const updateHasCompletedCv = asyncHandler(async (req, res) => {
  if (req.userType !== "user") {
    return sendError(res, "Doar utilizatorii își pot actualiza statusul CV-ului", 403);
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  const { status, hasCompleted } = req.body;

  let nextValue = true;
  if (typeof hasCompleted === "boolean") {
    nextValue = hasCompleted;
  } else if (typeof status === "boolean") {
    nextValue = status;
  } else if (typeof status === "string") {
    nextValue = ["completed", "true", "1"].includes(status.toLowerCase());
  }

  user.hasCompletedCv = nextValue;
  await user.save();

  sendSuccess(
    res,
    {
      hasCompletedCv: user.hasCompletedCv,
    },
    "Statusul CV-ului a fost actualizat"
  );
});
