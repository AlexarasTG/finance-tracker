package com.alexaras.finance_tracker.controller;

import com.alexaras.finance_tracker.model.Expense;
import com.alexaras.finance_tracker.service.ExpenseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExpenseController.class)
public class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExpenseService expenseService;

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void getExpenses() throws Exception {
        // Arrange: Mock the service response
        Expense expense1 = new Expense(BigDecimal.valueOf(50), "Food", "Groceries");
        expense1.setId(1L);
        Expense expense2 = new Expense(BigDecimal.valueOf(100), "Transport", "Bus ticket");
        expense2.setId(2L);

        when(expenseService.getAllExpenses()).thenReturn(Arrays.asList(expense1, expense2));

        // Act & Assert: Perform the GET request and verify the response
        mockMvc.perform(get("/api/v1/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].amount").value(50))
                .andExpect(jsonPath("$[0].category").value("Food"))
                .andExpect(jsonPath("$[0].description").value("Groceries"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].amount").value(100))
                .andExpect(jsonPath("$[1].category").value("Transport"))
                .andExpect(jsonPath("$[1].description").value("Bus ticket"));

        // Verify that the service method was called once
        verify(expenseService, times(1)).getAllExpenses();
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void addExpense() throws Exception {
        // Arrange: Create a new expense and mock the service response
        Expense newExpense = new Expense(BigDecimal.valueOf(200), "Utilities", "Electric bill");
        newExpense.setId(3L);

        when(expenseService.addExpense(any(Expense.class))).thenReturn(newExpense);

        // Act & Assert: Perform the POST request and verify the response
        mockMvc.perform(post("/api/v1/expenses")
                        .contentType("application/json")
                        .content("""
                   {
                       "amount": 200,
                       "category": "Utilities",
                       "description": "Electric bill"
                   }
               """)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.amount").value(200))
                .andExpect(jsonPath("$.category").value("Utilities"))
                .andExpect(jsonPath("$.description").value("Electric bill"));

        // Verify that the service method was called once
        verify(expenseService, times(1)).addExpense(any(Expense.class));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void deleteExpense() throws Exception {
        // Act & Assert: Perform the DELETE request with a CSRF token
        mockMvc.perform(delete("/api/v1/expenses/1").with(csrf()))
                .andExpect(status().isOk());

        // Verify that the service method was called once
        verify(expenseService, times(1)).deleteExpense(1L);
    }

}
