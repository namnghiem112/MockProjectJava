package com.example.mockproject.Entity.num;

public enum OfferStatus {
    WAITING_FOR_APPROVAL("waiting_for_approval"),
    APPROVED("approved"),
    REJECTED("rejected"),
    WAITING_FOR_RESPONSE("waiting_for_response"),
    ACCEPTED("accepted"),
    DECLINED("declined"),
    CANCELLED("cancelled");

    private String value;

    OfferStatus(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
