package com.OneDao.filter;

import com.OneDao.entity.User;
import com.OneDao.security.JwtService;
import com.OneDao.security.TokenBlacklistService;
import com.OneDao.store.InMemoryUserStore;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final InMemoryUserStore userStore;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Continue if Authorization header is missing
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        try {

            // Reject logged-out tokens
            if (tokenBlacklistService.isTokenBlacklisted(token)) {
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Token has been logged out"
                );
                return;
            }

            // Extract username from JWT
            String username = jwtService.extractUsername(token);

            // Authenticate only if no authentication exists
            if (username != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                User user = userStore.findByUsername(username)
                        .orElse(null);

                if (user != null && jwtService.isTokenValid(token, user)) {

                    String role = jwtService.extractRole(token);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    List.of(
                                            new SimpleGrantedAuthority("ROLE_" + role)
                                    )
                            );

                    authentication.setDetails(
                            new org.springframework.security.web.authentication
                                    .WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (RuntimeException exception) {

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}