package com.alexaras.finance_tracker.dao.impl;

import com.alexaras.finance_tracker.model.User;
import org.junit.jupiter.api.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS) // Share instance and setup
class UserDAOImplTest {

    private static final String TEST_DB_URL = "jdbc:sqlite::memory:";
    private Connection sharedConnection;
    private UserDAOImpl userDAO;

    @BeforeAll
    void setUpClass() {
        try {
            sharedConnection = DriverManager.getConnection(TEST_DB_URL);
            assertFalse(sharedConnection.isClosed(), "Connection should not be closed after creation.");
            System.out.println("Shared connection created: " + sharedConnection);
        } catch (Exception e) {
            fail("Failed to create shared connection: " + e.getMessage());
        }
    }

    @BeforeEach
    void setUp() {
        try {
            if (sharedConnection == null || sharedConnection.isClosed()) {
                fail("Connection is closed before the test. Check connection lifecycle.");
            }

            try (Statement stmt = sharedConnection.createStatement()) {
                stmt.execute("DROP TABLE IF EXISTS users");
                stmt.execute("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL)");
                System.out.println("Users table created successfully.");
            }

            userDAO = new UserDAOImpl(sharedConnection);
        } catch (Exception e) {
            fail("Failed to set up the in-memory database: " + e.getMessage());
        }
    }

    @AfterAll
    void tearDownClass() {
        try {
            if (sharedConnection != null && !sharedConnection.isClosed()) {
                sharedConnection.close();
                System.out.println("Shared connection closed.");
            }
        } catch (Exception e) {
            System.err.println("Failed to close shared connection: " + e.getMessage());
        }
    }

    @Test
    void testCreateUser() {
        User user = new User(0, "Alex", "alex@example.com");
        userDAO.createUser(user);

        List<User> users = userDAO.findAll();
        assertEquals(1, users.size());
        assertEquals("Alex", users.get(0).getName());
    }

    @Test
    void testFindById() {
        User user = new User(0, "Alex", "alex@example.com");
        userDAO.createUser(user);

        User fetchedUser = userDAO.findById(1);
        assertNotNull(fetchedUser, "Fetched user should not be null.");
        assertEquals("Alex", fetchedUser.getName());
    }

    @Test
    void testUpdateUser() {
        User user = new User(0, "Alex", "alex@example.com");
        userDAO.createUser(user);

        User updatedUser = new User(1, "Alex Updated", "alex_updated@example.com");
        userDAO.updateUser(updatedUser);

        User fetchedUser = userDAO.findById(1);
        assertNotNull(fetchedUser, "Fetched user should not be null after update.");
        assertEquals("Alex Updated", fetchedUser.getName());
        assertEquals("alex_updated@example.com", fetchedUser.getEmail());
    }

    @Test
    void testDeleteUser() {
        User user = new User(0, "Alex", "alex@example.com");
        userDAO.createUser(user);

        userDAO.deleteUser(1);

        User fetchedUser = userDAO.findById(1);
        assertNull(fetchedUser, "Fetched user should be null after deletion.");
    }
}
