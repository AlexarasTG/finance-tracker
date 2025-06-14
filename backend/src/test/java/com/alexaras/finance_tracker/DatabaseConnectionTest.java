package com.alexaras.finance_tracker;

import org.junit.jupiter.api.*;

import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseConnectionTest {

    private DatabaseConnection databaseConnection;

    @BeforeEach
    void setUp() {
        databaseConnection = new DatabaseConnection("jdbc:sqlite::memory:");
    }

    @Test
    void testConnectionEstablished() {
        try (Connection conn = databaseConnection.getConnection()) {
            assertNotNull(conn);
            assertFalse(conn.isClosed());
        } catch (Exception e) {
            fail("Connection test failed: " + e.getMessage());
        }
    }

    @Test
    void testInvalidConnection() {
        // Attempting to connect to a non-existent database path
        DatabaseConnection invalidDatabaseConnection = new DatabaseConnection("jdbc:sqlite:invalid.db");

        try (Connection conn = invalidDatabaseConnection.getConnection()) {
            // Assert that the connection is not null and is open
            assertNotNull(conn);
            assertFalse(conn.isClosed());

            // Additional validation: Confirm the database file was created
            assertTrue(new java.io.File("invalid.db").exists());
        } catch (Exception e) {
            fail("Unexpected exception during invalid connection test: " + e.getMessage());
        }
    }
}
