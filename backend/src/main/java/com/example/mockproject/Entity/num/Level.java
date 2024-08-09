package com.example.mockproject.Entity.num;
public enum Level {
    FRESHER("Fresher"),
    JUNIOR("Junior"),
    SENIOR("Senior"),
    LEADER("Leader"),
    MANAGER("Manager"),
    VICE_HEAD("Vice Head");

    private String value;

    Level(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
