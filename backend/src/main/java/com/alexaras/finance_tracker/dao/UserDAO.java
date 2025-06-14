package com.alexaras.finance_tracker.dao;

import com.alexaras.finance_tracker.model.User;
import java.util.List;

public interface UserDAO {
    User findById(int id);
    List<User> findAll();
    void createUser(User user);
    void updateUser(User user);
    void deleteUser(int id);
}
