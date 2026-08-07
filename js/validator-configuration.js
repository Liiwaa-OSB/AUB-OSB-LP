// validator-configuration.js - Generic configuration for all application pages

var VALIDATOR_CONFIG = {
    // Default Application Page (MBA, or any general apply page)
    apply_default: {
        fields: [
            { id: 'first_name', type: 'firstName', label: 'First Name' },
            { id: 'last_name', type: 'lastName', label: 'Last Name' },
            { id: 'email', type: 'email', label: 'Email' },
            { id: 'phone', type: 'phone', label: 'Phone' },
            { id: 'employer', type: 'company', label: 'Company' },
            { id: 'country_residence', type: 'countryResidence', label: 'Country of Residence' },
            { id: 'university', type: 'university', label: 'University' },
            { id: 'major', type: 'major', label: 'University Major' },
            { id: 'years_experience', type: 'yearsExp', label: 'Years of Experience' },
            { id: 'hear_about', type: 'hearAbout', label: 'How did you hear about us?' }
        ],
        descriptionFields: ['country_residence', 'university', 'major', 'hear_about'],
        localStorageFields: ['first_name', 'last_name', 'email']
    },

    // EMBA Application Page
    apply_emba: {
        fields: [
            { id: 'first_name', type: 'firstName', label: 'First Name' },
            { id: 'last_name', type: 'lastName', label: 'Last Name' },
            { id: 'email', type: 'email', label: 'Email' },
            { id: 'phone', type: 'phone', label: 'Phone' },
            { id: 'employer', type: 'company', label: 'Company' },
            { id: 'major', type: 'position', label: 'Position' },
            { id: 'years_experience', type: 'yearsExp', label: 'Years of Experience' }
        ],
        descriptionFields: ['major'],
        localStorageFields: ['first_name', 'last_name', 'email']
    },

    // Brochure Download Page
    brochure_default: {
        fields: [
            { id: 'first_name', type: 'firstName', label: 'First Name' },
            { id: 'last_name', type: 'lastName', label: 'Last Name' },
            { id: 'email', type: 'email', label: 'Email' },
            { id: 'phone', type: 'phone', label: 'Phone' }
        ],
        descriptionFields: [], // No extra fields to concatenate
        localStorageFields: ['first_name', 'last_name', 'email'],
        isBrochure: true // Flag to indicate brochure behavior
    },

    // ONLINE - OEP - LLI
    brochure_secondary: {
        fields: [
            { id: 'first_name', type: 'firstName', label: 'First Name' },
            { id: 'last_name', type: 'lastName', label: 'Last Name' },
            { id: 'email', type: 'email', label: 'Email' },
            { id: 'phone', type: 'phone', label: 'Phone' },
            { id: 'employer', type: 'company', label: 'Company' }
        ],
        descriptionFields: ['employer'], // Include company in description
        localStorageFields: ['first_name', 'last_name', 'email', 'employer'],
        isBrochure: true
    }
};