package biz.oneilindustries.filesharer.controller.advice;

import biz.oneilindustries.filesharer.exception.NotAuthorisedException;
import biz.oneilindustries.filesharer.exception.TokenException;
import biz.oneilindustries.filesharer.exception.TooManyLoginAttempts;
import biz.oneilindustries.filesharer.exception.UserException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import java.io.FileNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class ErrorPageControllerAdvice {

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity handleNoHandlerFoundException(NoHandlerFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getRequestURL() + " Not Found");
    }

    @ExceptionHandler(TooManyLoginAttempts.class)
    public ResponseEntity tooManyLoginAttemptsException(TooManyLoginAttempts ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Too many login attempts");
    }

    @ExceptionHandler(TokenException.class)
    public ResponseEntity tokenException(TokenException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(UserException.class)
    public ResponseEntity userException(UserException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity jwtException(JWTVerificationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity handleException(FileNotFoundException error) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(error.getMessage());
    }

    @ExceptionHandler(NotAuthorisedException.class)
    public ResponseEntity handleException(NotAuthorisedException error) {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(error.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity handleAll(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}
