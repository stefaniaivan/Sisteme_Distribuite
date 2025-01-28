package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.entities.User;

public class UserBuilder {
    private UserBuilder(){

    }

    public static User toEntity(UserDTO userDTO) {
        return new User(userDTO.getLastName(), userDTO.getFirstName(), userDTO.getEmail(), userDTO.getRole(), "defaultPassword");
    }

    public static UserDTO toUserDTO(User user) {
        return new UserDTO(user.getId(), user.getLastName(), user.getFirstName(), user.getEmail(), user.getRole());
    }
}
