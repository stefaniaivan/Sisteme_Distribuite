package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.builders.PersonBuilder;
import ro.tuc.ds2020.dtos.builders.UserBuilder;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.entities.User;
import ro.tuc.ds2020.repositories.PersonRepository;
import ro.tuc.ds2020.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UUID insert(User user) {
        //User user = UserBuilder.toEntity(userDTO);
        user = userRepository.save(user);
        LOGGER.debug("User with id {} was inserted in db", user.getId());
        return user.getId();
    }

    public List<UserDTO> findUsers() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(UserBuilder::toUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> findAdmins(String role) {
        List<User> userList = userRepository.findByRole("admin");
        return userList.stream()
                .map(UserBuilder::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findUserById(UUID id) {
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        return UserBuilder.toUserDTO(prosumerOptional.get());
    }

    public UserDTO findUserByEmail(String email){
        Optional<User> prosumerOptional = Optional.ofNullable(userRepository.findByEmail(email));
        if(!prosumerOptional.isPresent()){
            LOGGER.error("User with email {} was not found in db", email);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with email: " + email);
        }
        return UserBuilder.toUserDTO(prosumerOptional.get());
    }

    public User login(String email, String password){
        Optional<User> prosumerOptional = Optional.ofNullable(userRepository.findByEmail(email));
        if(prosumerOptional.isPresent()){
            User existingUser = prosumerOptional.get();

            if(existingUser.getPassword().equals(password)){
                return existingUser;
            }
        }
        return null;
    }

    public UserDTO updateUser(UUID id, UserDTO updatedUser){
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        User existingUser = prosumerOptional.get();
        if(updatedUser.getLastName() != null){
            existingUser.setLastName(updatedUser.getLastName());
        }
        if(updatedUser.getFirstName() != null){
            existingUser.setFirstName(updatedUser.getFirstName());
        }
        if(updatedUser.getEmail() != null){
            existingUser.setEmail(updatedUser.getEmail());
        }
        if(updatedUser.getRole() != null){
            existingUser.setRole(updatedUser.getRole());
        }

        userRepository.save(existingUser);
        LOGGER.info("Person with id {} was successfully updated.", id);

        return UserBuilder.toUserDTO(existingUser);
    }

    public void delete(UUID id){
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        userRepository.deleteById(id);
        LOGGER.info("User with id {} was successfully deleted.", id);
    }

    public UUID findUserIdByEmail(String email){
        UUID userId = userRepository.findByEmail(email).getId();
        return userId;
    }

}
