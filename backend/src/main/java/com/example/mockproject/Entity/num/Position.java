package com.example.mockproject.Entity.num;
public enum Position {
    BACKEND("Backend Developer"),
    BA("Business Analyst"),
    TESTER("Tester"),
    HR("HR"),
    PM("Project Manager"),
    NA("Not available");

    private String value;

    Position(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
