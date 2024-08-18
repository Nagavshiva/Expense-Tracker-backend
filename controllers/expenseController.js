const Expense = require('../models/Expense');


exports.addExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    // Validate required fields
    if (!amount || !category || !date) {
        return res.status(400).json({ message: 'Amount, category, and date are required' });
    }

    try {
        // Create a new expense document
        const expense = new Expense({
            user: req.user._id,
            amount,
            category,
            date,
            description,
        });

        // Save the expense to the database
        const createdExpense = await expense.save();

        // Respond with the created expense and a success message
        res.status(201).json({
            message: 'Expense successfully added',
            expense: createdExpense,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getExpenses = async (req, res) => {
    const { category, startDate, endDate, minAmount, maxAmount } = req.query;

    // Build the query object
    const query = { user: req.user._id };

    if (category) query.category = category;
    if (startDate || endDate) query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
    if (minAmount || maxAmount) query.amount = {};
    if (minAmount) query.amount.$gte = minAmount;
    if (maxAmount) query.amount.$lte = maxAmount;

    try {
        // Fetch expenses from the database based on the query
        const expenses = await Expense.find(query).sort({ date: -1 });

        // Respond with a message and the list of expenses
        res.json({
            message: 'Expenses retrieved successfully',
            expenses,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        // Check if expense exists and belongs to the logged-in user
        if (expense && expense.user.toString() === req.user._id.toString()) {
            await Expense.deleteOne({ _id: req.params.id }); // Use deleteOne to remove the document
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
    } catch (error) {
        console.error('Error deleting expense:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    // Validate required fields
    if (!amount || !category || !date) {
        return res.status(400).json({ message: 'Amount, category, and date are required' });
    }

    try {
        const expense = await Expense.findById(req.params.id);

        // Check if expense exists and belongs to the logged-in user
        if (expense && expense.user.toString() === req.user._id.toString()) {
            // Update the expense fields
            expense.amount = amount;
            expense.category = category;
            expense.date = date;
            expense.description = description;

            const updatedExpense = await expense.save(); // Save the updated expense

            res.json({
                message: 'Expense successfully updated',
                expense: updatedExpense,
            });
        } else {
            res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
    } catch (error) {
        console.error('Error updating expense:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};