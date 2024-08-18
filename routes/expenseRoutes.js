const express = require('express');
const { addExpense, getExpenses, deleteExpense,updateExpense  } = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Apply middleware to protect all routes under this router
router.use(protect);


router.post('/', addExpense);
router.get('/', getExpenses);
router.delete('/:id', deleteExpense);
router.put('/:id', updateExpense); 
module.exports = router;
