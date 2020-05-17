package biz.oneilindustries.filesharer.controller;

import static biz.oneilindustries.filesharer.AppConfig.FRONT_END_URL;
import static biz.oneilindustries.filesharer.AppConfig.SHARED_LINK_DIRECTORY;

import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.exception.UserException;
import biz.oneilindustries.filesharer.service.ShareLinkService;
import biz.oneilindustries.filesharer.service.SystemFileService;
import biz.oneilindustries.filesharer.service.UserService;
import biz.oneilindustries.filesharer.validation.ShareLinkForm;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
public class FileSharingController {

    private final SystemFileService systemFileService;
    private final UserService userService;
    private final ShareLinkService linkService;

    @Autowired
    public FileSharingController(SystemFileService systemFileService, UserService userService,
        ShareLinkService linkService) {
        this.systemFileService = systemFileService;
        this.userService = userService;
        this.linkService = linkService;
    }

    @PostMapping("/share")
    public ResponseEntity<String> createShareLink(ShareLinkForm form, HttpServletRequest request, Authentication username)
        throws IOException, FileUploadException, ParseException {
        Optional<User> checkUser = userService.getUser(username.getName());

        if (!checkUser.isPresent()) throw new UserException("Logged in user not found");
        User user = checkUser.get();

        long remainingQuota = userService.getRemainingQuota(user.getUsername());

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Link link = linkService.generateShareLink(user, format.parse(form.getExpires()));

        List<File> uploadedFiles = systemFileService.handleFileUpload(request, remainingQuota, String.format(SHARED_LINK_DIRECTORY + "%s",
            user.getUsername(), link.getId()));

        //Link only saves after the files have been handled to prevent Ghost links in case the file saving process failed
        linkService.saveLink(link);

        long shareSize = linkService.shareFiles(uploadedFiles, link);
        userService.incrementUsedQuota(shareSize, user.getUsername());

        return ResponseEntity.ok(FRONT_END_URL + "/shared/" + link.getId());
    }

    @GetMapping("/download/{link}")
    public void downloadFiles(@PathVariable String link, HttpServletResponse response) throws IOException {
        Link sharedLink = linkService.checkLinkExists(link);

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", String.format("attachment;filename=%s.zip", sharedLink.getId()));

        systemFileService.streamFolderAsZip(String.format(SHARED_LINK_DIRECTORY + "%s", sharedLink.getCreator().getUsername(), sharedLink.getId()),
            response.getOutputStream());
    }

    @DeleteMapping("/delete/{link}")
    public ResponseEntity<HttpStatus> deleteSharedLink(@PathVariable String link) {
        linkService.deleteLink(link);

        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping("/file/dl/{fileID}")
    public ResponseEntity<StreamingResponseBody> downloadFileFromLink(@PathVariable String fileID, HttpServletResponse response) {

        SharedFile file = linkService.checkFileWithLinkExists(fileID);
        Link sharedLink = file.getLink();

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", String.format("attachment;filename=%s", file.getName()));

        StreamingResponseBody streamedFile = systemFileService.streamFile(String.format(SHARED_LINK_DIRECTORY + "%s/%s",
            sharedLink.getCreator().getUsername(), sharedLink.getId(), file.getName()));

        return ResponseEntity.status(HttpStatus.OK).contentLength(file.getSize()).cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS)).body(streamedFile);
    }
}
