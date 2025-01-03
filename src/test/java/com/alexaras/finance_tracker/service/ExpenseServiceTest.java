package com.alexaras.finance_tracker.service;

import com.alexaras.finance_tracker.model.Expense;
import com.alexaras.finance_tracker.repository.ExpenseRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ExpenseServiceTest {

    private final ExpenseRepository expenseRepository = Mockito.mock(ExpenseRepository.class);
    private final ExpenseService expenseService = new ExpenseService(expenseRepository);

    @Test
    void updateExpense() {
        // Arrange: Mock the repository to simulate an existing expense
        Expense existingExpense = new Expense(BigDecimal.valueOf(50), "Food", "Groceries");
        existingExpense.setId(1L); // Explicitly set the ID
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(existingExpense));

        // Mock the save behavior
        when(expenseRepository.save(any(Expense.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // New data for the update
        Expense updatedExpense = new Expense(BigDecimal.valueOf(100), "Entertainment", "Cinema");

        // Act: Call the service method
        Expense result = expenseService.updateExpense(1L, updatedExpense);

        // Assert: Verify the results
        assertEquals(BigDecimal.valueOf(100), result.getAmount());
        assertEquals("Entertainment", result.getCategory());
        assertEquals("Cinema", result.getDescription());

        // Verify that the repository's save method was called with the updated expense
        verify(expenseRepository, times(1)).save(existingExpense);
    }

}
