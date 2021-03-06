package biz.oneilindustries.filesharer.eventlisteners;

import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.service.EmailSender;
import biz.oneilindustries.filesharer.service.UserService;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

@Component
public class RegistrationListener implements
        ApplicationListener<OnRegistrationCompleteEvent> {

    private static final String RECEIVER_EMAIL = "blackielifegfgaming@gmail.com";

    @Autowired
    private UserService service;

    @Autowired
    @Qualifier("customMessageSource")
    private MessageSource messages;

    @Autowired
    private EmailSender emailSender;

    @Override
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        this.confirmRegistration(event);
    }

    private void confirmRegistration(OnRegistrationCompleteEvent event) {
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        service.createVerificationToken(user, token);

        String recipientAddress = user.getEmail();
        String subject = "Registration Confirmation";
        String confirmationUrl
                = event.getAppUrl() + "/confirmEmail/" + token;

        String message = messages.getMessage("message.regSucc", null, event.getLocale());

        emailSender.sendSimpleEmail(recipientAddress,subject,message + " " + confirmationUrl,"Oneil_Industries", null);
        emailSender.sendSimpleEmail(RECEIVER_EMAIL, "New User",user.getUsername() + " has registered to Oneil Industries","Oneil_Industries", null);
    }
}