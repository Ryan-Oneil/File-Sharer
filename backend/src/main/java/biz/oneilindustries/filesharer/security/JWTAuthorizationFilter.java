package biz.oneilindustries.filesharer.security;


import static biz.oneilindustries.filesharer.security.SecurityConstants.HEADER_STRING;
import static biz.oneilindustries.filesharer.security.SecurityConstants.SECRET;
import static biz.oneilindustries.filesharer.security.SecurityConstants.TOKEN_PREFIX;

import biz.oneilindustries.filesharer.service.UserService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.stereotype.Component;

@Component
public class JWTAuthorizationFilter extends BasicAuthenticationFilter {


    private UserService userService;

    @Autowired
    public JWTAuthorizationFilter(AuthenticationManager authManager) {
        super(authManager);
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader(HEADER_STRING);

        if (header == null || !header.startsWith(TOKEN_PREFIX)) {
            chain.doFilter(req, res);
            return;
        }
        UsernamePasswordAuthenticationToken authentication = getAuthentication(req);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        String token = request.getHeader(HEADER_STRING);

        if (token == null) {
            return null;
        }

        DecodedJWT decodedToken;
        try {
            decodedToken = JWT.require(Algorithm.HMAC512(SECRET.getBytes()))
                .build()
                .verify(token.replace(TOKEN_PREFIX, ""));
        }catch (JWTVerificationException e) {
            return null;
        }
        if (!decodedToken.getSubject().equalsIgnoreCase("authToken")) {
            return null;
        }

        if (decodedToken.getExpiresAt() != null && decodedToken.getExpiresAt().before(new Date())) {
            return null;
        }

        if (!decodedToken.getClaim("enabled").asBoolean()) {
            return null;
        }
        return returnAuth(decodedToken);
    }

    private UsernamePasswordAuthenticationToken returnAuth(DecodedJWT decodedToken) {
        String user = decodedToken.getClaim("user").asString();
        String role = decodedToken.getClaim("role").asString();

        ArrayList<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return new UsernamePasswordAuthenticationToken(user, null, authorities);
    }
}