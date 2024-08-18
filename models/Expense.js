const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({

    user:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
})

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;