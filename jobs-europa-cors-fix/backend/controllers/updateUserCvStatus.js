// backend/controllers/updateUserCvStatus.js
import User from "../models/User.js";

export const updateHasCompletedCv = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Lipsește userId-ul." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
    }

    user.hasCompletedCv = true;
    await user.save();

    res.status(200).json({ message: "CV marcat ca finalizat." });
  } catch (error) {
    console.error("Eroare la actualizarea statusului CV:", error);
    res.status(500).json({ message: "Eroare server", error });
  }
};
