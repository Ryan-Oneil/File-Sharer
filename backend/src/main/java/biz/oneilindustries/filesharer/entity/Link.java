package biz.oneilindustries.filesharer.entity;

import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "link")
public class Link {

    @Id
    private String id;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "creator", referencedColumnName = "username")
    private User creator;

    @Column(name = "expiry_datetime")
    private Date expiryDatetime;

    @OneToMany(mappedBy = "link")
    private List<SharedFile> files;

    public Link() {
    }

    public Link(String id, User creator, Date expiryDatetime) {
        this.id = id;
        this.creator = creator;
        this.expiryDatetime = expiryDatetime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public Date getExpiryDatetime() {
        return expiryDatetime;
    }

    public void setExpiryDatetime(Date expiryDatetime) {
        this.expiryDatetime = expiryDatetime;
    }

    public List<SharedFile> getFiles() {
        return files;
    }
}
