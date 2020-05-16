package biz.oneilindustries.filesharer.exception;

public class NotAuthorisedException extends RuntimeException {

    public NotAuthorisedException(String error) {
        super(error);
    }
}
