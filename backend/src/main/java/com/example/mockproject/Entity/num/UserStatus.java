package com.example.mockproject.Entity.num;

public enum UserStatus {
    ACTIVE("active"),
    INACTIVE("inactive");

    private String value;

    UserStatus(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
