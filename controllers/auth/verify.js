const { User } = require("../../models");

const { RequestError } = require("../../helpers");

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findById({ verificationToken });
  if (!user) {
    throw RequestError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    status: "success",
    code: 200,
    message: "Verification successful",
  });
};

module.exports = verify;
