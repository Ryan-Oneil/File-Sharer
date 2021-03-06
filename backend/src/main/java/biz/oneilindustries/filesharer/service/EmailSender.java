package biz.oneilindustries.filesharer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailSender {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleEmail(String recipientAddress, String subject, String message, String sender, String replyTo) {

        sender = StringUtils.trimAllWhitespace(sender);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message);
        email.setFrom(sender);

        if (replyTo != null) {
            email.setReplyTo(replyTo);
        }
        mailSender.send(email);
    }
}
