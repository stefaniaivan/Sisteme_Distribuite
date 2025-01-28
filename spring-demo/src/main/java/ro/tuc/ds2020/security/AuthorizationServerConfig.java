//package ro.tuc.ds2020.security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
//import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
//import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
//import org.springframework.security.oauth2.server.authorization.token.OAuth2AccessTokenGenerator;
//import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
//import org.springframework.security.oauth2.server.authorization.token.JwtGenerator;
//import org.springframework.security.web.SecurityFilterChain;
//import ro.tuc.ds2020.util.JwtUtil;
//
//import java.time.Duration;
//
//@Configuration
//public class AuthorizationServerConfig {
//
//    @Bean
//    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http) throws Exception {
//        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer =
//                OAuth2AuthorizationServerConfigurer.authorizationServer();
//
//        http
//                .authorizeHttpRequests(authz -> authz
//                        .requestMatchers("user/login").permitAll()
//                        .requestMatchers("/oauth2/**").permitAll()
//                        .anyRequest().authenticated()
//                )
//                .csrf(csrf -> csrf.ignoringRequestMatchers("/oauth2/**"));
//
//        return http.build();
//    }
//
//    @Bean
//    public AuthorizationServerSettings authorizationServerSettings() {
//        return AuthorizationServerSettings.builder()
//                .issuer("http://localhost:8080/spring-demo")
//                .build();
//    }
//
//    @Bean
//    public TokenSettings tokenSettings() {
//        return TokenSettings.builder()
//                .accessTokenTimeToLive(Duration.ofHours(1))
//                .refreshTokenTimeToLive(Duration.ofDays(30))
//                .build();
//    }
//}
