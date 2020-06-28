package biz.oneilindustries.filesharer.service;

import biz.oneilindustries.filesharer.dto.QuotaDTO;
import biz.oneilindustries.filesharer.dto.UserDTO;
import biz.oneilindustries.filesharer.entity.PasswordResetToken;
import biz.oneilindustries.filesharer.entity.Quota;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.entity.VerificationToken;
import biz.oneilindustries.filesharer.exception.TokenException;
import biz.oneilindustries.filesharer.exception.UserException;
import biz.oneilindustries.filesharer.repository.QuotaRepository;
import biz.oneilindustries.filesharer.repository.ResetPasswordTokenRepository;
import biz.oneilindustries.filesharer.repository.UserRepository;
import biz.oneilindustries.filesharer.repository.VerificationTokenRepository;
import biz.oneilindustries.filesharer.validation.LoginForm;
import biz.oneilindustries.filesharer.validation.UpdatedUser;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import org.apache.commons.io.FileUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public static final String USERNAME_REGEX = "^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";
    private final UserRepository userRepository;
    private final QuotaRepository quotaRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final ResetPasswordTokenRepository resetPasswordTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, QuotaRepository quotaRepository,
        VerificationTokenRepository verificationTokenRepository, ResetPasswordTokenRepository resetPasswordTokenRepository,
        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.quotaRepository = quotaRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.resetPasswordTokenRepository = resetPasswordTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Iterable<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUser(String user) {
        return userRepository.getByUsername(user).orElseThrow(() -> new UserException(user + " not found"));
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.getUsersByEmail(email);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User registerUser(LoginForm loginForm) {
        String username = loginForm.getUsername();
        String email = loginForm.getEmail();

        validateUsername(username);
        validateEmail(email);

        String encryptedPassword = passwordEncoder.encode(loginForm.getPassword());

        User user = new User(username.toLowerCase(), encryptedPassword,false, email, "ROLE_UNREGISTERED");
        Quota quota = new Quota(username, 0, 25, false);

        saveUser(user);
        quotaRepository.save(quota);

        return user;
    }

    public void validateUsername(String username) {
        if (!username.matches(USERNAME_REGEX)) {
            throw new UserException("Username may only contain a-Z . _");
        }

        if (userRepository.isUsernameTaken(username.toLowerCase())) {
            throw new UserException("Username is taken");
        }
    }

    public void validateEmail(String email) {
        if (userRepository.isEmailTaken(email.toLowerCase())) {
            throw new UserException("Email is taken");
        }
    }

    public void updateUser(UpdatedUser updatedUser, String name) {
        User user = getUser(name);

        if (updatedUser.getEmail() != null) {
            if (!updatedUser.getEmail().equals(user.getEmail())) {
                validateEmail(updatedUser.getEmail());
            }
            user.setEmail(updatedUser.getEmail());
        }

        if (updatedUser.getEnabled() != null) {
            user.setEnabled(updatedUser.getEnabled());
        }

        if (updatedUser.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        if (updatedUser.getRole() != null) {
            user.setRole(updatedUser.getRole());
        }
        saveUser(user);
    }

    public void createVerificationToken(User user, String token) {
        VerificationToken myToken = new VerificationToken(token, user);
        saveVerificationToken(myToken);
    }

    public Optional<VerificationToken> getToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }

    public Optional<VerificationToken> getTokenByUser(User user) {
        return verificationTokenRepository.findByUsername(user);
    }

    public void saveVerificationToken(VerificationToken token) {
        verificationTokenRepository.save(token);
    }

    public void deleteVerificationToken(VerificationToken token) {
        verificationTokenRepository.delete(token);
    }

    public String generateResetToken(User user) {
        Optional<PasswordResetToken> passwordResetToken = resetPasswordTokenRepository.getByUsername(user);

        if (passwordResetToken.isPresent()) {
            if (!isExpired(passwordResetToken.get().getExpiryDate())) {
                return passwordResetToken.get().getToken();
            }else {
                //Deletes from database if the existing token is expired
                deletePasswordResetToken(passwordResetToken.get());
            }
        }
        String token = UUID.randomUUID().toString();

        resetPasswordTokenRepository.save(new PasswordResetToken(token,user));

        return token;
    }

    public Optional<PasswordResetToken> getResetToken(String token) {
        return resetPasswordTokenRepository.getByToken(token);
    }

    public void changeUserPassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));

        saveUser(user);
    }

    public void deletePasswordResetToken(PasswordResetToken token) {
        resetPasswordTokenRepository.delete(token);
    }

    public boolean isExpired(Date date) {

        Calendar cal = Calendar.getInstance();
        return (date.getTime() - cal.getTime().getTime()) <= 0;
    }

    public long getRemainingQuota(String username) {
        AtomicReference<Long> remaining = new AtomicReference<>(0L);

        Optional<Quota> userQuota = quotaRepository.findById(username);

        userQuota.ifPresent(quota -> {
            if (quota.isIgnoreQuota()) {
                remaining.set(-1L);
            }else {
                long remainingAmount = (quota.getMax() * FileUtils.ONE_GB) - quota.getUsed();
                remaining.set(Math.max(remainingAmount, 0));
            }
        });
        return remaining.get();
    }

    public void incrementUsedQuota(long amount, String username) {
        Optional<Quota> userQuota = quotaRepository.findById(username);

        userQuota.ifPresent(quota -> {
            quota.increaseUsed(amount);
            quotaRepository.save(quota);
        });
    }

    public void decreaseUsedQuota(long amount, String username) {
        Optional<Quota> userQuota = quotaRepository.findById(username);

        userQuota.ifPresent(quota -> {
            quota.decreaseUsed(amount);
            quotaRepository.save(quota);
        });
    }

    public VerificationToken validateVerificationToken(String tokenID) {
        Optional<VerificationToken> verificationToken = getToken(tokenID);

        if (!verificationToken.isPresent()) {
            throw new TokenException("Invalid link");
        }
        if (isExpired(verificationToken.get().getExpiryDate())) {
            throw new TokenException("Expired verification link");
        }
        return verificationToken.get();
    }

    public PasswordResetToken validatePasswordResetToken(String tokenID) {
        Optional<PasswordResetToken> passwordResetToken = getResetToken(tokenID);

        if (!passwordResetToken.isPresent()) {
            throw new TokenException("Invalid link");
        }
        if (isExpired(passwordResetToken.get().getExpiryDate())) {
            throw new TokenException("Expired Password reset link");
        }
        return passwordResetToken.get();
    }

    public Quota getUserQuota(String user) {
        return quotaRepository.findById(user).orElseThrow(()-> new UserException("User not found"));
    }

    public long getTotalUsedQuota() {
        return quotaRepository.getTotalUsed();
    }

    public UserDTO getUserStats(String username) {
        Quota quota = getUserQuota(username);
        User user = getUser(username);

        QuotaDTO quotaDTO = quotaToDTO(quota);
        UserDTO userDTO = userToDTO(user);
        userDTO.setQuota(quotaDTO);

        return userDTO;
    }

    public QuotaDTO quotaToDTO(Quota quota) {
        return new QuotaDTO(quota.getUsed(), quota.getMax(), quota.isIgnoreQuota());
    }

    public HashMap<String, Object> getAllUsers(Pageable pageable) {
        HashMap<String, Object> users = new HashMap<>();
        users.put("total", userRepository.getUserCount());
        users.put("users", usersToDTOs(userRepository.getAllUsers(pageable)));

        return users;
    }

    public List<UserDTO> usersToDTOs(List<User> users) {
        return users.stream()
            .map(this::userToDTO)
            .collect(Collectors.toList());
    }

    public UserDTO userToDTO(User user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getEnabled());
    }
}
