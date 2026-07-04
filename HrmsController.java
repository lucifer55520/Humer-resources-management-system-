HrmsController.java

package com.hrms.controller;
import com.hrms.dto.*;
import com.hrms.models.*;
import com.hrms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class HrmsController {

    @Autowired private UserRepository userRepository;
    @Autowired private LeaveRequestRepository leaveRepository;

    @PostMapping("/auth/signin")
    public ResponseEntity<String> signIn(@RequestBody SigninRequest req) {
        Optional<User> user = userRepository.findByEmail(req.email());
        if (user.isEmpty() || !user.get().getPassword().equals(req.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect credentials");
        }
        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/leave/apply/{userId}")
    public ResponseEntity<String> applyLeave(@PathVariable Long userId, @RequestBody LeaveSubmitRequest req) {
        LeaveRequest leave = new LeaveRequest();
        // Set fields...
        leaveRepository.save(leave);
        return ResponseEntity.ok("Leave submitted");
    }
}
