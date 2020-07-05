// Soundarya - Expense model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
var User = mongoose.model("user");

// Data model for expenses
const expenseSchema = new Schema(
  {
    Amount: { type: Number, required: true },
    // Amount: { type: Number },
    Note: { type: String },
    Category: { type: String, required: true },
    // Category: { type: String },
    User: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    created: { type: Date, default: Date.now }
  },
  { collection: "expense" }
);

// Export model
module.exports = mongoose.model("expense", expenseSchema);
