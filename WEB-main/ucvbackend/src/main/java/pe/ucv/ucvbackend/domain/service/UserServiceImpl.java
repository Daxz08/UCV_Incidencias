package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.Role;
import pe.ucv.ucvbackend.domain.dto.RegisterRequest;
import pe.ucv.ucvbackend.domain.repository.UserRepository;
import pe.ucv.ucvbackend.domain.service.UserService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, 
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(RegisterRequest request) {
        User user = new User();

        user.setFirstName(request.getFirstname());
        user.setLastName(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUsername(request.getNickname());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserRole(Role.USER);  
        user.setPosition(request.getCargo());
        user.setIsActive(true);

        return userRepository.save(user);
    }

    @Override
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll(); 
    }

    @Override
    public User update(Long id, RegisterRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setFirstName(request.getFirstname());
        user.setLastName(request.getLastname());
        user.setPhone(request.getPhone());
        user.setPosition(request.getCargo());
        user.setUsername(request.getNickname());

        return userRepository.save(user);
    }

    @Override
    public void delete(Long id) {
        Optional<User> user = userRepository.findById(id);
        user.ifPresent(u -> {
            u.setIsActive(false); 
            userRepository.save(u);
        });
    }
}
