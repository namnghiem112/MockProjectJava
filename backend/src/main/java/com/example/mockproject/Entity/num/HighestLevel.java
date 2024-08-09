package com.example.mockproject.Entity.num;
public enum HighestLevel {
    HIGH_SCHOOL("High school"),
    BACHELORS("Bachelor's Degree"),
    MASTERS("Master Degree, PhD");

    private String value;

    HighestLevel(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
