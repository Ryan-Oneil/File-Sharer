package biz.oneilindustries.filesharer.dto;

import java.util.Date;
import java.util.List;

public class LinkDTO {

    private String id;
    private Date expiryDatetime;
    private List<FileDTO> files;

    public LinkDTO(String id, Date expiryDatetime, List<FileDTO> files) {
        this.id = id;
        this.expiryDatetime = expiryDatetime;
        this.files = files;
    }

    public LinkDTO(String id, Date expiryDatetime) {
        this.id = id;
        this.expiryDatetime = expiryDatetime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getExpiryDatetime() {
        return expiryDatetime;
    }

    public void setExpiryDatetime(Date expiryDatetime) {
        this.expiryDatetime = expiryDatetime;
    }

    public List<FileDTO> getFiles() {
        return files;
    }

    public void setFiles(List<FileDTO> files) {
        this.files = files;
    }
}
