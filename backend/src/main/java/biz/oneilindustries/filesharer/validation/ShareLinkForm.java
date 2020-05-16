package biz.oneilindustries.filesharer.validation;

public class ShareLinkForm {

    private String title;

    private String password;

    private String expires;

    public ShareLinkForm(String title, String password, String expires) {
        this.title = title;
        this.password = password;
        this.expires = expires;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getExpires() {
        return expires;
    }

    public void setExpires(String expires) {
        this.expires = expires;
    }

    @Override
    public String toString() {
        return "ShareLinkForm{" +
            "title='" + title + '\'' +
            ", password='" + password + '\'' +
            ", expires=" + expires +
            '}';
    }
}
