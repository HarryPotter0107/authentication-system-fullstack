
package com.OneDao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CountryRestrictionService {

    private final Set<String> blockedCountries;

    public CountryRestrictionService(
            @Value("${registration.blocked-countries:}")
            String countries
    ) {
        this.blockedCountries = Arrays.stream(countries.split(","))
                .map(String::trim)
                .filter(code -> !code.isEmpty())
                .map(String::toUpperCase)
                .collect(Collectors.toSet());
    }

    public boolean isRegistrationAllowed(String countryCode) {

        if (countryCode == null || countryCode.isBlank()) {
            return false;
        }

        return !blockedCountries.contains(
                countryCode.trim().toUpperCase()
        );
    }
}
