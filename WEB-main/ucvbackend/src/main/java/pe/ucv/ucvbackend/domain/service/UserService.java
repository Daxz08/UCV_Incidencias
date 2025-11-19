package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.dto.RegisterRequest;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User register(RegisterRequest request);
    Optional<User> getById(Long id);
    Optional<User> getByEmail(String email);
    List<User> getAll();
    User update(Long id, RegisterRequest request);
    void delete(Long id);
}
