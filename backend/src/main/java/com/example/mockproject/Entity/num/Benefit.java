package com.example.mockproject.Entity.num;
public enum Benefit {
    LUNCH("Lunch"),
    LEAVE_25_DAY("25-day leave"),
    HEALTHCARE_INSURANCE("Healthcare insurance"),
    HYBRID_WORKING("Hybrid working"),
    TRAVEL("Travel");

    private String value;

    Benefit(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
