package biz.oneilindustries.filesharer.controller;

import static biz.oneilindustries.filesharer.AppConfig.FRONT_END_URL;

import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.entity.VerificationToken;
import biz.oneilindustries.filesharer.eventlisteners.OnRegistrationCompleteEvent;
import biz.oneilindustries.filesharer.service.EmailSender;
import biz.oneilindustries.filesharer.service.UserService;
import biz.oneilindustries.filesharer.validation.LoginForm;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class LoginController {

    private final UserService userService;

    private final ApplicationEventPublisher eventPublisher;

    private final EmailSender emailSender;

    @Autowired
    public LoginController(UserService userService, ApplicationEventPublisher eventPublisher, EmailSender emailSender) {
        this.userService = userService;
        this.eventPublisher = eventPublisher;
        this.emailSender = emailSender;
    }

    @PostMapping("/register")
    public ResponseEntity registerUser(@RequestBody @Valid LoginForm loginForm, HttpServletRequest request) {

        Optional<User> user = userService.getUser(loginForm.getName());

        if (user.isPresent()) {
            return ResponseEntity.badRequest().body("An account with this username already exists");
        }

        user = userService.getUserByEmail(loginForm.getEmail());

        if (user.isPresent()) {
            return ResponseEntity.badRequest().body("An account with this email already exists");
        }

        User newUser = userService.registerUser(loginForm);

        eventPublisher.publishEvent(new OnRegistrationCompleteEvent
            (newUser, request.getLocale(), FRONT_END_URL));

        return ResponseEntity.ok("A confirmation email has been sent. You will need to confirm it before you can login");
    }

    @PostMapping("/registrationConfirm/{token}")
    public ResponseEntity confirmRegistration(@PathVariable String token) {

        VerificationToken verificationToken = userService.getToken(token);

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
        emailSender.sendSimpleEmail(user.get().getEmail(),"Password Reset","Reset Password Link " + FRONT_END_URL + "/resetPassword/" + token,"Oneil-Industries",null);

        return ResponseEntity.ok("Password reset email has been sent");
    }

    @PostMapping("/newPassword/{token}")
    public ResponseEntity setNewPassword(@PathVariable String token, @RequestParam String password) {

        User user = userService.getResetToken(token).getUsername();

        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid Password Reset Token");
        }
        userService.deletePasswordResetToken(userService.getResetToken(token));
        userService.changeUserPassword(user, password);

        return ResponseEntity.ok("Password has been changed");
    }
}
