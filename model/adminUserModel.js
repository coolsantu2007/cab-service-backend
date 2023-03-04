const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
mongoose.set('strictQuery', true);
const bcrypt = require('bcrypt');

const adminUserSchema = new Schema({
  Name: {
    type: String,
    default: ""
  },
  Mobile: {
    type: String,
    default: ""
  },

  Email: {
    type: String,
    default: ""
  },

  Password: {
    type: String,
    default: ""
  },

  Role: {
    type: String,
    default: "Admin"
  },

  JWT_Token: {
    type: Array,
    default: []
  },

  createdDate: { type: Date, default: Date.now }
});

adminUserSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 10)
  }
  next();
});

adminUserSchema.methods.comparePassword = async function (Password) {
  const result = await bcrypt.compare(Password, this.Password)
  return result;
};

adminUserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("admin_user", adminUserSchema);