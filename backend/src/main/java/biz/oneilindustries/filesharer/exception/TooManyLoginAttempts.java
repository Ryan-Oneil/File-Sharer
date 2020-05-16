package biz.oneilindustries.filesharer.exception;

import org.springframework.security.core.AuthenticationException;

public class TooManyLoginAttempts extends AuthenticationException {

    public TooManyLoginAttempts(String msg) {
        super(msg);
    }
}
