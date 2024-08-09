package com.example.mockproject.Entity.num;

public enum InterviewStatus {
    NEW("new"),
    INVITED("invited"),
    REMINDED("reminded"),
    INTERVIEWED("interviewed"),
    CANCELLED("cancelled");

    private String value;

    InterviewStatus(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
