package com.example.mockproject.Controller.render;

import com.example.mockproject.Repository.UserRepository;
import com.example.mockproject.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@CrossOrigin("*")
@RequestMapping("")
public class RenderController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/resetpassword")
    public String newPassword(HttpServletRequest request, Model model, HttpServletResponse response){
        String verifyKey = request.getParameter("verifyKey");
        if(verifyKey == null || verifyKey.isEmpty() || userRepository.getUserByToken(verifyKey) == 0){
            model.addAttribute("title", "Link đổi mật khẩu không hợp lệ");
            return "warn";
        }
        if(userService.isKeyExpired(verifyKey)) {
            model.addAttribute("title", "Link đổi mật khẩu đã hết hạn...");
            return "warn";
        }
        else {
            model.addAttribute("verifyKey", verifyKey);
            return "newPassword";
        }
    }
}
