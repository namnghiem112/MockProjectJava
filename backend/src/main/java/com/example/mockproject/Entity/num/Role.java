package com.example.mockproject.Entity.num;

public enum Role {
    ADMIN("admin"),
    RECRUITER("recruiter"),
    INTERVIEWER("interviewer"),
    MANAGER("manager");

    private String value;

    Role(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
