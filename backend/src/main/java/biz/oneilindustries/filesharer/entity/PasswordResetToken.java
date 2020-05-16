package biz.oneilindustries.filesharer.entity;

import biz.oneilindustries.filesharer.entity.supers.Token;
import javax.persistence.Entity;

@Entity(name = "password_reset_token")
public class PasswordResetToken extends Token {

    public PasswordResetToken() {
    }

    public PasswordResetToken(String token, User username) {
        super(token, username);
    }
}
