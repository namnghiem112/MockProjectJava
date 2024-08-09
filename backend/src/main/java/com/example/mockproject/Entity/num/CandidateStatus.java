package com.example.mockproject.Entity.num;

public enum CandidateStatus {
    WAITING_FOR_INTERVIEW("WAITING_FOR_INTERVIEW"),
    WAITING_FOR_APPROVAL("WAITING_FOR_APPROVAL"),
    WAITING_FOR_RESPONSE("WAITING_FOR_RESPONSE"),
    OPEN("OPEN"),
    PASSED_INTERVIEW("PASSED_INTERVIEW"),
    APPROVED_OFFER("APPROVED_OFFER"),
    REJECTED_OFFER("REJECTED_OFFER"),
    ACCEPTED_OFFER("ACCEPTED_OFFER"),
    DECLINED_OFFER("DECLINED_OFFER"),
    CANCELLED_OFFER("CANCELLED_OFFER"),
    FAILED_INTERVIEW("FAILED_INTERVIEW"),
    CANCELLED_INTERVIEW("CANCELLED_INTERVIEW"),
    BANNED("BANNED");

    private String value;

    CandidateStatus(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }

    public static CandidateStatus fromValue(String value) {
        for (CandidateStatus status : CandidateStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("No enum constant for value: " + value);
    }
}
