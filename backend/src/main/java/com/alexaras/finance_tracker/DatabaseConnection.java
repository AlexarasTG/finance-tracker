package com.alexaras.finance_tracker;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    private final String url;

    // Default Constructor for Production
    public DatabaseConnection() {
        this.url = "jdbc:sqlite:finance_tracker.db";
    }

    // Custom Constructor for Testing or Alternate Databases
    public DatabaseConnection(String customUrl) {
        this.url = customUrl;
    }

    // Method to Establish Connection
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url);
    }

    public static void main(String[] args) {
        DatabaseConnection dbConnection = new DatabaseConnection();
        try (Connection conn = dbConnection.getConnection()) {
            if (conn != null) {
                System.out.println("Connection to SQLite has been established.");
            }
        } catch (SQLException e) {
            System.err.println("Failed to establish connection: " + e.getMessage());
        }
    }
}
