package com.example.mockproject.Entity.num;

public enum InterviewResult {
    PASSED("Passed"),
    FAILED("Failed");

    private String value;

    InterviewResult(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
