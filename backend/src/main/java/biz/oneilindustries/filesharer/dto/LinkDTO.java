package biz.oneilindustries.filesharer.dto;

import java.util.Date;
import java.util.List;

public class LinkDTO {

    private String title;
    private String id;
    private String expiryDatetime;
    private List<FileDTO> files;
    private long size;

    public LinkDTO(String title, String id, Date expiryDatetime, List<FileDTO> files, long size) {
        this.title = title;
        this.id = id;
        this.expiryDatetime = expiryDatetime.toString();
        this.files = files;
        this.size = size;
    }

    public LinkDTO(String title, String id, Date expiryDatetime, long size) {
        this.title = title;
        this.id = id;
        this.expiryDatetime = expiryDatetime.toString();
        this.size = size;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getExpiryDatetime() {
        return expiryDatetime;
    }

    public void setExpiryDatetime(String expiryDatetime) {
        this.expiryDatetime = expiryDatetime;
    }

    public List<FileDTO> getFiles() {
        return files;
    }

    public void setFiles(List<FileDTO> files) {
        this.files = files;
    }

    public long getSize() {
        return size;
    }

    public String getTitle() {
        return title;
    }
}
