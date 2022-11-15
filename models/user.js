const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = Schema(
  {
    name: {
      type: String,
      require: [true, "Set name for user"],
    },
    email: {
      type: String,
      require: true,
      unique: [true, "Email is required"],
    },
    password: {
      type: String,
      require: [true, "Set password for user"],
      minlength: 6,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

const joiRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string(),
  token: Joi.string(),
  avatarURL: Joi.string(),
  verify: Joi.string(),
  verificationToken: Joi.string(),
});

const joiLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().required(),
});

const User = model("user", userSchema);

const schemas = {
  joiRegisterSchema,
  joiLoginSchema,
  verifyEmailSchema,
};

module.exports = {
  User,
  schemas,
};
