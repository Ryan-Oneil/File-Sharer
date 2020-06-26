package biz.oneilindustries.filesharer.aspects;

import static biz.oneilindustries.filesharer.AppConfig.ADMIN_ROLES;

import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.exception.NotAuthorisedException;
import biz.oneilindustries.filesharer.service.ShareLinkService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class AuthAspect {

    private final ShareLinkService linkService;

    public AuthAspect(ShareLinkService linkService) {
        this.linkService = linkService;
    }

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.deleteSharedLink(..))")
    private void deleteLink() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.editLink(..))")
    private void editLink() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.deleteFile(..))")
    private void deleteFile() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.addFilesToLink(..))")
    private void addFiles() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.displayUser*(..))")
    private void fileShareUserLinks() {}

    //User controller
    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.UserController.getRemainingQuota(..))")
    private void displayUserQuota() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.UserController.getUserDetails(..))")
    private void displayUserDetails() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.UserController.updateUserDetails(..))")
    private void updateUserDetails() {}

    @Before("deleteLink() || addFiles() || editLink()")
    public void hasLinkPermission(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();

        String linkID = (String) args[0];
        User user = (User) ((Authentication) args[1]).getPrincipal();

        Link link = linkService.getLinkCheckPresence(linkID);

        if (!link.getCreator().getUsername().equalsIgnoreCase(user.getUsername()) && !ADMIN_ROLES.contains(user.getRole())) {
            throw new NotAuthorisedException("You don't have permission to do this");
        }
    }

    @Before("deleteFile()")
    public void hasFilePermission(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();

        String fileID = (String) args[0];
        User user = (User) ((Authentication) args[1]).getPrincipal();

        SharedFile file = linkService.checkFileLinkValidation(fileID);

        if (!file.getLink().getCreator().getUsername().equalsIgnoreCase(user.getUsername()) && !ADMIN_ROLES.contains(user.getRole())) {
            throw new NotAuthorisedException("You don't have permission to do this");
        }
    }

    @Before("fileShareUserLinks() || displayUserQuota() || displayUserDetails() || updateUserDetails()")
    public void hasUserPermission(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();

        String username = (String) args[0];
        User user = (User) ((Authentication) args[1]).getPrincipal();
        String callingUser = user.getUsername();

        if (!username.equalsIgnoreCase(callingUser) && !ADMIN_ROLES.contains(user.getRole())) {
            throw new NotAuthorisedException("You don't have permission to do this");
        }
    }
}
