package biz.oneilindustries.filesharer.service;

import biz.oneilindustries.filesharer.dto.QuotaDTO;
import biz.oneilindustries.filesharer.entity.UserDTO;
import biz.oneilindustries.filesharer.exception.TokenException;
import biz.oneilindustries.filesharer.repository.QuotaRepository;
import biz.oneilindustries.filesharer.repository.ResetPasswordTokenRepository;
import biz.oneilindustries.filesharer.repository.UserRepository;
import biz.oneilindustries.filesharer.repository.VerificationTokenRepository;
import biz.oneilindustries.filesharer.entity.PasswordResetToken;
import biz.oneilindustries.filesharer.entity.Quota;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.entity.VerificationToken;
import biz.oneilindustries.filesharer.exception.UserException;
import biz.oneilindustries.filesharer.validation.LoginForm;
import biz.oneilindustries.filesharer.validation.UpdatedUser;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public static final String USERNAME_REGEX = "^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuotaRepository quotaRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private ResetPasswordTokenRepository resetPasswordTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Iterable<User> getUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUser(String name) {
        return userRepository.getByUsername(name);
    }

    public User checkUserExists(String user) {
        Optional<User> checkUser = getUser(user);

        if (!checkUser.isPresent()) throw new UserException("Logged in user not found");

        return checkUser.get();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.getUsersByEmail(email);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User registerUser(LoginForm loginForm) {

        if (!loginForm.getUsername().matches(USERNAME_REGEX)) {
            throw new UserException("Username may only contain a-Z . _");
        }
        String encryptedPassword = passwordEncoder.encode(loginForm.getPassword());
        String username = loginForm.getUsername();

        User user = new User(username.toLowerCase(), encryptedPassword,false, loginForm.getEmail(), "ROLE_UNREGISTERED");

        saveUser(user);

        return user;
    }

    public void updateUser(UpdatedUser updatedUser, String name) throws UsernameNotFoundException {
        Optional<User> checkUser = getUser(name);

        if (!checkUser.isPresent()) {
            throw new UsernameNotFoundException(name + " doesn't exists");
        }
        User user = checkUser.get();

        if (updatedUser.getUsername() != null) {
            user.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getEmail() != null) {
            if (!updatedUser.getEmail().equals(user.getEmail())) {
                Optional<User> isEmailTaken = getUserByEmail(updatedUser.getEmail());

                if (isEmailTaken.isPresent()) {
                    throw new UserException("Email is already registered to another user");
                }
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
                remaining.set((quota.getMax() * FileUtils.ONE_GB) - quota.getUsed());
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
        Optional<Quota> userQuota = quotaRepository.findById(user);

        if (!userQuota.isPresent()) throw new UserException("User not found");
        return userQuota.get();
    }

    public QuotaDTO quotaToDTO(Quota quota) {
        return new QuotaDTO(quota.getUsed(), quota.getMax(), quota.isIgnoreQuota());
    }

    public UserDTO userToDTO(User user) {
        return new UserDTO(user.getUsername(), user.getEmail(), user.getRole(), user.getEnabled());
    }
}
