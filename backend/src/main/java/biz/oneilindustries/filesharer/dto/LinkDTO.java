package biz.oneilindustries.filesharer.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class LinkDTO {

    private String title;
    private String id;
    private String expiryDatetime;
    private List<FileDTO> files = new ArrayList<>();
    private long size;
    private long views;

    public LinkDTO(String title, String id, Date expiryDatetime, List<FileDTO> files, long size, long views) {
        this.title = title;
        this.id = id;
        this.expiryDatetime = expiryDatetime.toString();
        this.files = files;
        this.size = size;
        this.views = views;
    }

    public LinkDTO(String title, String id, Date expiryDatetime, long size, long views) {
        this.title = title;
        this.id = id;
        this.expiryDatetime = expiryDatetime.toString();
        this.size = size;
        this.views = views;
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

    public long getViews() {
        return views;
    }
}
