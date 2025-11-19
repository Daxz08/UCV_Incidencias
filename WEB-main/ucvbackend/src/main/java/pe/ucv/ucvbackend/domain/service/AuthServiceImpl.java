package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.Role;
import pe.ucv.ucvbackend.domain.dto.AuthResponse;
import pe.ucv.ucvbackend.domain.dto.AuthenticationRequest;
import pe.ucv.ucvbackend.domain.dto.RegisterRequest;
import pe.ucv.ucvbackend.domain.repository.UserRepository;
import pe.ucv.ucvbackend.domain.config.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        logger.info("Processing registration for: {}", request.getEmail());

        // 1. Verificar si el usuario ya existe
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("El usuario ya existe");
        }

        // 2. Determinar el rol según el cargo
        Role assignedRole = Role.USER;
        if (request.getCargo() != null && !"Estudiante".equalsIgnoreCase(request.getCargo().trim())) {
            assignedRole = Role.ADMIN;
        }

        // 3. Crear el usuario (DOMAIN OBJECT)
        User user = new User();
        user.setFirstName(request.getFirstname());
        user.setLastName(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUsername(request.getNickname());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserRole(assignedRole);
        user.setPosition(request.getCargo());
        user.setIsActive(true);

        // 4.Guardar directamente User (Domain Object)
        User savedUser = userRepository.save(user);
        logger.info("Usuario registrado exitosamente: {}", savedUser.getEmail());

        // 5. Generar token JWT
        String jwtToken = jwtService.generateToken(savedUser);

        // 6. Retornar respuesta
        return AuthResponse.create(jwtToken);
    }

    @Override
    public AuthResponse authenticate(AuthenticationRequest request) {
        logger.info("Processing authentication for: {}", request.getEmail());

        // 1. Autenticar con Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Buscar User directamente
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // 3. Generar token JWT
        String jwtToken = jwtService.generateToken(user);
        logger.info("Usuario autenticado exitosamente: {}", user.getEmail());
        logger.info("Token JWT generado para el usuario autenticado");

        // 4. Retornar respuesta
        return AuthResponse.create(jwtToken);
    }
}