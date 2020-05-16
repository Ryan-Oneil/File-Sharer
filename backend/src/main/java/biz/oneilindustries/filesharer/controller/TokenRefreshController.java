package biz.oneilindustries.filesharer.controller;

import static biz.oneilindustries.filesharer.security.SecurityConstants.EXPIRATION_TIME;
import static biz.oneilindustries.filesharer.security.SecurityConstants.REFRESH_TOKEN_PREFIX;
import static biz.oneilindustries.filesharer.security.SecurityConstants.SECRET;
import static com.auth0.jwt.algorithms.Algorithm.HMAC512;

import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.exception.TokenException;
import biz.oneilindustries.filesharer.service.UserService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.util.Date;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/token")
public class TokenRefreshController {

    private final UserService userService;

    @Autowired
    public TokenRefreshController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/refresh")
    public String refreshToken(@RequestBody String refreshToken) {
        // parse the token.
        DecodedJWT decodedToken = JWT.require(Algorithm.HMAC512(SECRET.getBytes()))
            .build()
            .verify(refreshToken.replace(REFRESH_TOKEN_PREFIX, ""));

        if (!decodedToken.getSubject().equalsIgnoreCase("refreshToken")) {
            throw new TokenException("Not a valid refresh Token");
        }

        if (decodedToken.getExpiresAt().before(new Date())) {
            throw new TokenException("Refresh token is expired");
        }
        Optional<User> user = userService.getUser(decodedToken.getClaim("user").asString());

        if (!user.isPresent()) {
            throw new UsernameNotFoundException("Username not found");
        }
        return "Bearer " + JWT.create()
            .withSubject("authToken")
            .withClaim("user", user.get().getUsername())
            .withClaim("role", user.get().getAuthorities().get(0).getAuthority())
            .withClaim("enabled", user.get().getEnabled())
            .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .sign(HMAC512(SECRET.getBytes()));
    }
}
