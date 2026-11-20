
package com.OneDao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class IpGeolocationService {

    private final RestClient restClient;

    @Value("${registration.test-country-override-enabled:false}")
    private boolean testOverrideEnabled;

    public IpGeolocationService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://ipapi.co")
                .build();
    }

    public String getCountryCode(
            String ipAddress,
            String testCountryCode
    ) {

        // Development-only country testing
        if (testOverrideEnabled
                && testCountryCode != null
                && !testCountryCode.isBlank()) {

            return testCountryCode.trim().toUpperCase();
        }

        // Validate IP address
        if (ipAddress == null || ipAddress.isBlank()
                || ipAddress.equals("127.0.0.1")
                || ipAddress.equals("::1")
                || ipAddress.startsWith("192.168.")
                || ipAddress.startsWith("10.")) {

            throw new IllegalArgumentException(
                    "Unable to determine country from this IP address"
            );
        }

        // Fetch country code from IP geolocation API
        String countryCode = restClient.get()
                .uri("/{ip}/country/", ipAddress)
                .retrieve()
                .body(String.class);

        if (countryCode == null || countryCode.isBlank()) {
            throw new IllegalStateException(
                    "Country lookup failed"
            );
        }

        return countryCode.trim().toUpperCase();
    }
}
