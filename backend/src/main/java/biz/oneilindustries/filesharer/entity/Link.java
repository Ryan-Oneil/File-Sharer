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

    private String title;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "creator", referencedColumnName = "username")
    private User creator;

    @Column(name = "expiry_datetime")
    private Date expiryDatetime;

    @OneToMany(mappedBy = "link", orphanRemoval = true)
    private List<SharedFile> files;

    private long size = 0;

    public Link() {
    }

    public Link(String id, String title, User creator, Date expiryDatetime, long size) {
        this.id = id;
        this.title = title;
        this.creator = creator;
        this.expiryDatetime = expiryDatetime;
        this.size = size;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public long getSize() {
        return size;
    }
}
