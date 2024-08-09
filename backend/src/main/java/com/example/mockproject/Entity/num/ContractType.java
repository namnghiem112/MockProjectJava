package com.example.mockproject.Entity.num;
public enum ContractType {
    TRIAL_2_MONTHS("Trial 2 months"),
    TRAINEE_3_MONTHS("Trainee 3 months"),
    ONE_YEAR("1 year"),
    THREE_YEARS("3 years"),
    UNLIMITED("Unlimited");

    private String value;

    ContractType(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
