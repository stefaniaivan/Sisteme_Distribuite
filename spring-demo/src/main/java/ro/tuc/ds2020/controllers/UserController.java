package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.entities.User;
import ro.tuc.ds2020.services.UserService;
import ro.tuc.ds2020.util.JwtUtil;

import javax.validation.Valid;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping(value = "/user")
public class UserController {
    private final UserService userService;


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserDTO> dtos = userService.findUsers();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable("id") UUID userId) {
        UserDTO dto = userService.findUserById(userId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping(value= "/admins")
    public ResponseEntity<List<UserDTO>> getAdmins(){
        List<UserDTO> dtos = userService.findAdmins("admin");
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @RequestBody UserDTO updatedUser) {
        UserDTO updatedUserDTO = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(updatedUserDTO);
    }

    @PostMapping()
    public ResponseEntity<UUID> insertUser(@Valid @RequestBody User user) {
        UUID userID = userService.insert(user);
        return new ResponseEntity<>(userID, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User loggedInUser = userService.login(user.getEmail(), user.getPassword());
        if (loggedInUser != null) {
            Map<String, Object> response = new HashMap<>();
            String token = jwtUtil.generateToken(loggedInUser.getEmail(), loggedInUser.getRole());
            response.put("message", "Successful Login!");
            response.put("token", token);
            return ResponseEntity.ok().header("User-Role", loggedInUser.getRole()).body(response);
        } else {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Invalid email or password!"));
        }
    }

    @GetMapping("/getUserId")
    public ResponseEntity<UUID> getUserIdByEmail(@RequestParam String email) {
        UUID userId = userService.findUserIdByEmail(email);
        return ResponseEntity.ok(userId);
    }

    @GetMapping("/getUserByEmail")
    public ResponseEntity<UserDTO> getUserByEmail(@RequestParam String email) {
        UserDTO user = userService.findUserByEmail(email);
        return ResponseEntity.ok(user);
    }

}
