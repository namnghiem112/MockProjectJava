package com.example.mockproject.Entity.num;
public enum Department {
    IT("IT"),
    HR("HR"),
    FINANCE("Finance"),
    COMMUNICATION("Communication"),
    MARKETING("Marketing"),
    ACCOUNTING("Accounting");

    private String value;

    Department(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
