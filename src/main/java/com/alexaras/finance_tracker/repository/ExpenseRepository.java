package com.alexaras.finance_tracker.repository;

import com.alexaras.finance_tracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}