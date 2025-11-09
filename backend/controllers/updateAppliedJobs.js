import User from "../models/User.js";
import Job from "../models/Job.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";

export const updateAppliedJobs = asyncHandler(async (req, res) => {
  const { jobId, action } = req.body;

  if (!jobId || !action) {
    return sendError(res, "JobId și acțiunea sunt obligatorii", 400);
  }

  if (req.userType !== "user") {
    return sendError(res, "Doar utilizatorii pot modifica aplicațiile", 403);
  }

  let user = null;
  if (req.user?._id) {
    user = await User.findById(req.user._id);
  }
  if (!user && req.user?.userId) {
    user = await User.findOne({ userId: req.user.userId });
  }

  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return sendError(res, "Jobul nu a fost găsit", 404);
  }

  const existingUserApplication = user.appliedJobs.find(
    (entry) => entry.job?.toString() === job._id.toString()
  );

  if (action === "apply") {
    if (!existingUserApplication) {
      user.appliedJobs.push({
        job: job._id,
        appliedAt: new Date(),
        status: "pending",
      });
    }

    const hasJobApplication = job.applications.some(
      (entry) => entry.user.toString() === req.user._id.toString()
    );

    if (!hasJobApplication) {
      job.applications.push({
        user: req.user._id,
        appliedAt: new Date(),
        status: "pending",
      });
    }
  } else if (action === "remove") {
    if (existingUserApplication) {
      user.appliedJobs = user.appliedJobs.filter(
        (entry) => entry.job?.toString() !== job._id.toString()
      );
    }

    const initialLength = job.applications.length;
    job.applications = job.applications.filter(
      (entry) => entry.user.toString() !== req.user._id.toString()
    );
    if (job.applications.length !== initialLength) {
      job.markModified("applications");
    }
  } else {
    return sendError(res, "Acțiune invalidă. Folosește apply sau remove", 400);
  }

  await user.save();
  await job.save();

  const populatedUserQuery = User.findById(user._id)
    .select("appliedJobs")
    .populate({
      path: "appliedJobs.job",
      select: "title location type category employer",
      populate: { path: "employer", select: "companyName" },
    });

  const populatedUser = await populatedUserQuery;

  sendSuccess(
    res,
    {
      appliedJobs: populatedUser.appliedJobs,
    },
    action === "apply"
      ? "Job adăugat în lista de aplicații"
      : "Job eliminat din lista de aplicații"
  );
});

export const getAppliedJobs = asyncHandler(async (req, res) => {
  if (req.userType !== "user") {
    return sendError(res, "Doar utilizatorii pot accesa aplicațiile", 403);
  }

  try {
    let user = null;

    if (req.user?._id) {
      user = await User.findById(req.user._id)
        .select("appliedJobs")
        .populate({
          path: "appliedJobs.job",
          select: "title location type category employer",
          populate: { path: "employer", select: "companyName" },
        });
    }

    if (!user && req.user?.userId) {
      user = await User.findOne({ userId: req.user.userId })
        .select("appliedJobs")
        .populate({
          path: "appliedJobs.job",
          select: "title location type category employer",
          populate: { path: "employer", select: "companyName" },
        });
    }

    if (!user) {
      return sendError(res, "Utilizatorul nu a fost găsit", 404);
    }

    sendSuccess(res, { appliedJobs: user.appliedJobs || [] }, "Lista de aplicații");
  } catch (error) {
    console.error("getAppliedJobs error:", error);
    return sendError(res, "Eroare la preluarea aplicațiilor", 500);
  }
});
