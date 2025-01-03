package com.alexaras.finance_tracker.integration;

import com.alexaras.finance_tracker.model.Expense;
import com.alexaras.finance_tracker.repository.ExpenseRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
public class ExpenseIntegrationTest {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Test
    void testCreateAndRetrieveExpense() {
        // Arrange: Create a new expense
        Expense newExpense = new Expense(BigDecimal.valueOf(75), "Food", "Dinner");
        expenseRepository.save(newExpense);

        // Act: Retrieve all expenses
        List<Expense> expenses = expenseRepository.findAll();

        // Assert: Verify the retrieved data
        assertEquals(1, expenses.size());
        assertEquals("Dinner", expenses.get(0).getDescription());
        assertEquals(BigDecimal.valueOf(75), expenses.get(0).getAmount());
        assertEquals("Food", expenses.get(0).getCategory());
    }

    @Test
    void testRetrieveExpensesByCategory() {
        // Arrange: Save multiple expenses with different categories
        Expense expense1 = new Expense(BigDecimal.valueOf(50), "Food", "Groceries");
        Expense expense2 = new Expense(BigDecimal.valueOf(100), "Transport", "Bus ticket");
        Expense expense3 = new Expense(BigDecimal.valueOf(75), "Food", "Dinner");

        expenseRepository.save(expense1);
        expenseRepository.save(expense2);
        expenseRepository.save(expense3);

        // Act: Find expenses by category
        List<Expense> foodExpenses = expenseRepository.findByCategory("Food");

        // Assert: Verify results
        assertEquals(2, foodExpenses.size());
        assertEquals("Groceries", foodExpenses.get(0).getDescription());
        assertEquals("Dinner", foodExpenses.get(1).getDescription());
    }

    @Test
    void testUpdateExpense() {
        // Arrange: Save an expense
        Expense expense = new Expense(BigDecimal.valueOf(50), "Food", "Groceries");
        expenseRepository.save(expense);

        // Act: Update the expense
        expense.setAmount(BigDecimal.valueOf(75));
        expense.setDescription("Updated Groceries");
        expenseRepository.save(expense);

        // Retrieve the updated expense
        Expense updatedExpense = expenseRepository.findById(expense.getId()).orElseThrow();

        // Assert: Verify the update
        assertEquals(BigDecimal.valueOf(75), updatedExpense.getAmount());
        assertEquals("Updated Groceries", updatedExpense.getDescription());
    }

    @Test
    void testDeleteExpense() {
        // Arrange: Save an expense
        Expense expense = new Expense(BigDecimal.valueOf(50), "Food", "Groceries");
        expenseRepository.save(expense);

        // Act: Delete the expense
        expenseRepository.deleteById(expense.getId());

        // Assert: Verify the expense is deleted
        boolean exists = expenseRepository.existsById(expense.getId());
        assertEquals(false, exists);
    }

    @Test
    void testRetrieveNoExpenses() {
        // Act: Retrieve all expenses from an empty database
        List<Expense> expenses = expenseRepository.findAll();

        // Assert: Verify the result is empty
        assertEquals(0, expenses.size());
    }

}
