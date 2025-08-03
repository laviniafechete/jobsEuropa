import User from "../models/User.js";

export const updateAppliedJobs = async (req, res) => {
  const { userId, jobId } = req.body;

  if (!userId || !jobId) {
    return res.status(400).json({ message: "Lipsesc userId sau jobId." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
    }

    if (!user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
      await user.save();
    }

    res
      .status(200)
      .json({ message: "Job adăugat cu succes în lista de aplicații." });
  } catch (error) {
    console.error("Eroare la actualizarea listei de joburi aplicate:", error);
    res.status(500).json({ message: "Eroare server", error });
  }
};
