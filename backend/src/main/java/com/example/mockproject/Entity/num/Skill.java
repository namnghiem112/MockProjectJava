package com.example.mockproject.Entity.num;
public enum Skill {
    JAVA("Java"),
    NODEJS("Nodejs"),
    DOTNET(".net"),
    CPP("C++"),
    BA("Business analysis"),
    COMMUNICATION("Communication");

    private String value;

    Skill(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
