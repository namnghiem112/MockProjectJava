package com.example.mockproject.Entity.num;

public enum JobStatus {
    OPEN("open"),
    DRAFTED("drafted"),
    CLOSED("closed");
    private String value;

    JobStatus(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
