//package ro.tuc.ds2020.security;
//
//import com.nimbusds.jose.jwk.source.JWKSource;
//import com.nimbusds.jose.proc.SecurityContext;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.security.oauth2.jwt.JwtEncoder;
//import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
//import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
//import org.springframework.security.oauth2.server.authorization.token.JwtGenerator;
//
//import java.security.KeyPair;
//import java.security.KeyPairGenerator;
//import java.security.interfaces.RSAPublicKey;
//
//@Configuration
//public class JwtConfig {
//
//    private final JWKSource<SecurityContext> jwkSource;
//
//    public JwtConfig(JWKSource<SecurityContext> jwkSource) {
//        this.jwkSource = jwkSource;
//    }
//
//    @Bean
//    public JwtEncoder jwtEncoder() {
//        return new NimbusJwtEncoder(jwkSource);
//    }
//
//    @Bean
//    public JwtDecoder jwtDecoder() {
//        return NimbusJwtDecoder.withPublicKey(getPublicKey()).build();
//    }
//
//    @Bean
//    public JwtGenerator jwtGenerator(JwtEncoder jwtEncoder) {
//        return new JwtGenerator(jwtEncoder);
//    }
//
//    private RSAPublicKey getPublicKey() {
//        try {
//            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
//            keyPairGenerator.initialize(2048);
//            KeyPair keyPair = keyPairGenerator.generateKeyPair();
//            return (RSAPublicKey) keyPair.getPublic();
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to generate public key", e);
//        }
//    }
//}
