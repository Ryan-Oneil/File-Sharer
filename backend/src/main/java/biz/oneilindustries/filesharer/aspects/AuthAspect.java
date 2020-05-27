package biz.oneilindustries.filesharer.aspects;

import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
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

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.displayUsersLink(..))")
    private void viewUserLinks() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.editLink(..))")
    private void editLink() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.deleteFile(..))")
    private void deleteFile() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.addFilesToLink(..))")
    private void addFiles() {}

    @Pointcut("execution(* biz.oneilindustries.filesharer.controller.FileSharingController.displayUserLinkStats(..))")
    private void displayUserLinkStats() {}


    @Before("deleteLink() || addFiles() || editLink()")
    public void hasLinkPermission(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();

        String linkID = (String) args[0];
        String username = ((Authentication)args[1]).getName();

        Link link = linkService.getLinkCheckPresence(linkID);

        if (!link.getCreator().getUsername().equals(username)) {
            throw new NotAuthorisedException("You don't have permission to do this");
        }
    }

    @Before("deleteFile()")
    public void hasFilePermission(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();

        String fileID = (String) args[0];
        String username = ((Authentication)args[1]).getName();

        SharedFile file = linkService.checkFileLinkValidation(fileID);

        if (!file.getLink().getCreator().getUsername().equals(username)) {
            throw new NotAuthorisedException("You don't have permission to do this");
        }
    }

    @Before("viewUserLinks() || displayUserLinkStats()")
    public void hasUserPermission(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();

        String username = (String) args[0];
        String callingUser = ((Authentication)args[1]).getName();

        if (!username.equals(callingUser)) {
            throw new NotAuthorisedException("You don't have permission to do this");
        }
    }
}
