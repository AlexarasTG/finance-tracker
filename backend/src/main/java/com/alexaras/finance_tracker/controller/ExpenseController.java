package com.alexaras.finance_tracker.controller;

import com.alexaras.finance_tracker.model.Expense;
import com.alexaras.finance_tracker.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@Tag(name = "Expense", description = "Expense management APIs")
public class ExpenseController {
    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    @Operation(summary = "Get all expenses", description = "Retrieves a list of all expenses")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of expenses")
    public List<Expense> getExpenses() {
        return expenseService.getAllExpenses();
    }

    @PostMapping
    @Operation(summary = "Add a new expense", description = "Creates a new expense entry")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Expense successfully created",
                content = @Content(schema = @Schema(implementation = Expense.class))),
        @ApiResponse(responseCode = "400", description = "Invalid expense data supplied")
    })
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an expense", description = "Updates an existing expense by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Expense successfully updated"),
        @ApiResponse(responseCode = "404", description = "Expense not found"),
        @ApiResponse(responseCode = "400", description = "Invalid expense data supplied")
    })
    public Expense updateExpense(
            @Parameter(description = "ID of the expense to update") @PathVariable Long id, 
            @RequestBody Expense updatedExpense) {
        return expenseService.updateExpense(id, updatedExpense);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense", description = "Deletes an expense by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Expense successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Expense not found")
    })
    public void deleteExpense(
            @Parameter(description = "ID of the expense to delete") @PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}