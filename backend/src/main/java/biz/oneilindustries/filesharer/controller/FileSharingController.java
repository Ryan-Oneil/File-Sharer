package biz.oneilindustries.filesharer.controller;

import static biz.oneilindustries.filesharer.AppConfig.FRONT_END_URL;
import static biz.oneilindustries.filesharer.AppConfig.SHARED_LINK_DIRECTORY;

import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.exception.UserException;
import biz.oneilindustries.filesharer.service.FileService;
import biz.oneilindustries.filesharer.service.ShareLinkService;
import biz.oneilindustries.filesharer.service.UserService;
import biz.oneilindustries.filesharer.validation.ShareLinkForm;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FileSharingController {

    private final FileService fileService;
    private final UserService userService;
    private final ShareLinkService linkService;

    @Autowired
    public FileSharingController(FileService fileService, UserService userService,
        ShareLinkService linkService) {
        this.fileService = fileService;
        this.userService = userService;
        this.linkService = linkService;
    }

    @PostMapping("/share")
    public ResponseEntity createShareLink(ShareLinkForm form, HttpServletRequest request, Authentication username)
        throws IOException, FileUploadException, ParseException {
        Optional<User> checkUser = userService.getUser(username.getName());

        if (!checkUser.isPresent()) throw new UserException("Invalid logged in user");
        User user = checkUser.get();

        long remainingQuota = userService.getRemainingQuota(user.getUsername());

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
        Link link = linkService.createShareLink(user, format.parse(form.getExpires()));

        List<File> uploadedFiles = fileService.handleFileUpload(request, remainingQuota, String.format(SHARED_LINK_DIRECTORY + "%s", user.getUsername(), link.getId()));

        long shareSize = linkService.shareFiles(uploadedFiles, link);
        userService.incrementUsedQuota(shareSize, user.getUsername());

        return ResponseEntity.ok(FRONT_END_URL + "/shared/" + link.getId());
    }

    @GetMapping("/download/{link}")
    public void downloadFiles(@PathVariable String link, HttpServletResponse response) throws IOException {
        Link sharedLink = linkService.checkLinkExists(link);

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment;filename=link.zip");

        fileService.streamFolderAsZip(String.format(SHARED_LINK_DIRECTORY + "%s", sharedLink.getCreator().getUsername(), sharedLink.getId()),
            response.getOutputStream());
    }
}
