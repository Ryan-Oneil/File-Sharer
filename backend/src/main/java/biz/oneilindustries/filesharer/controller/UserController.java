package biz.oneilindustries.filesharer.controller;

import static biz.oneilindustries.filesharer.AppConfig.FRONT_END_URL;

import biz.oneilindustries.filesharer.dto.QuotaDTO;
import biz.oneilindustries.filesharer.dto.UserDTO;
import biz.oneilindustries.filesharer.entity.PasswordResetToken;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.entity.VerificationToken;
import biz.oneilindustries.filesharer.eventlisteners.OnRegistrationCompleteEvent;
import biz.oneilindustries.filesharer.service.EmailSender;
import biz.oneilindustries.filesharer.service.UserService;
import biz.oneilindustries.filesharer.validation.LoginForm;
import biz.oneilindustries.filesharer.validation.UpdatedUser;
import java.util.HashMap;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;
    private final EmailSender emailSender;

    @Autowired
    public UserController(UserService userService, ApplicationEventPublisher eventPublisher, EmailSender emailSender) {
        this.userService = userService;
        this.eventPublisher = eventPublisher;
        this.emailSender = emailSender;
    }

    @PostMapping("/register")
    public ResponseEntity registerUser(@RequestBody @Valid LoginForm loginForm, HttpServletRequest request) {
        User newUser = userService.registerUser(loginForm);

        eventPublisher.publishEvent(new OnRegistrationCompleteEvent
            (newUser, request.getLocale(), FRONT_END_URL));

        return ResponseEntity.ok("A confirmation email has been sent. You will need to confirm it before you can login");
    }

    @PostMapping("/registrationConfirm/{token}")
    public ResponseEntity confirmRegistration(@PathVariable String token) {
        VerificationToken verificationToken = userService.validateVerificationToken(token);

        User user = verificationToken.getUsername();

        userService.deleteVerificationToken(verificationToken);

        user.setEnabled(true);
        userService.saveUser(user);

        return ResponseEntity.ok("Account has been successfully verified!");
    }

    @PostMapping("/forgotPassword/{email}")
    public ResponseEntity sendResetToken(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);

        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid Email");
        }
        //Will generate a new token or send a previously generated one if exists and not expired
        String token = userService.generateResetToken(user.get());
        emailSender.sendSimpleEmail(user.get().getEmail(),"Password Reset","Reset Password Link " + FRONT_END_URL
            + "/confirmPassword/" + token,"Oneil-Industries",null);

        return ResponseEntity.ok("Password reset email has been sent");
    }

    @PostMapping("/newPassword/{token}")
    public ResponseEntity setNewPassword(@PathVariable String token, @RequestBody UpdatedUser updatedUser) {
        PasswordResetToken passwordResetToken = userService.validatePasswordResetToken(token);
        Optional<User> user = Optional.ofNullable(passwordResetToken.getUsername());

        if (!user.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid Password Reset Token");
        }
        userService.deletePasswordResetToken(passwordResetToken);
        userService.changeUserPassword(user.get(), updatedUser.getPassword());

        return ResponseEntity.ok("Password has been changed");
    }

    @GetMapping("/{username}/quota")
    public ResponseEntity<QuotaDTO> getRemainingQuota(@PathVariable String username, Authentication user) {
        return ResponseEntity.ok(userService.quotaToDTO(userService.getUserQuota(username)));
    }

    @GetMapping("/{username}/details")
    public ResponseEntity<UserDTO> getUserDetails(@PathVariable String username, Authentication user) {
        return ResponseEntity.ok(userService.userToDTO(userService.getUser(username)));
    }

    @PutMapping("/{username}/details/update")
    public ResponseEntity<HttpStatus> updateUserDetails(@PathVariable String username, Authentication user, @RequestBody UpdatedUser updatedUser) {
        userService.updateUser(updatedUser, username);

        return ResponseEntity.ok(HttpStatus.OK);
    }

    //Admin related apis
    @GetMapping("/admin/users/quota/used")
    public ResponseEntity<Long> getUsedQuota() {
        return ResponseEntity.ok(userService.getTotalUsedQuota());
    }

    @GetMapping("/admin/users")
    public ResponseEntity<HashMap<String, Object>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }
}
