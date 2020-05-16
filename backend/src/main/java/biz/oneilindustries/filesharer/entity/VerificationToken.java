package biz.oneilindustries.filesharer.entity;

import biz.oneilindustries.filesharer.entity.supers.Token;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "verificationtoken")
public class VerificationToken extends Token {

    public VerificationToken() {
    }

    public VerificationToken(String token, User username) {
        super(token, username);
    }
}
