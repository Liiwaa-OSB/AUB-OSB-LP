// validator-config.js
var VALIDATOR_CONFIG = {
    // MBA page configuration
    mba: {
        fields: [
            { id: 'first_name', type: 'firstName', required: true, label: 'First Name' },
            { id: 'last_name', type: 'lastName', required: true, label: 'Last Name' },
            { id: 'email', type: 'email', required: true, label: 'Email' },
            { id: 'phone', type: 'phone', required: true, label: 'Phone' },
            { id: 'employer', type: 'company', required: true, label: 'Company' },
            { id: 'country_residence', type: 'countryResidence', required: true, label: 'Country of Residence' },
            { id: 'university', type: 'university', required: true, label: 'University' },
            { id: 'major', type: 'major', required: true, label: 'University Major' },
            { id: 'years_experience', type: 'yearsExp', required: true, label: 'Years of Experience' },
            { id: 'hear_about', type: 'hearAbout', required: true, label: 'How did you hear about us?' }
        ],
        descriptionFields: ['country_residence', 'university', 'major', 'hear_about'],
        localStorageFields: ['first_name', 'last_name', 'email'],
        campaignValue: 'Apply MBA',
        retURL: 'https://www.aub.edu.lb/osb/Landing/Pages/GR-MBA-Apply-ThankYou.html'
    },

    // EMBA page configuration
    emba: {
        fields: [
            { id: 'first_name', type: 'firstName', required: true, label: 'First Name' },
            { id: 'last_name', type: 'lastName', required: true, label: 'Last Name' },
            { id: 'email', type: 'email', required: true, label: 'Email' },
            { id: 'phone', type: 'phone', required: true, label: 'Phone' },
            { id: 'employer', type: 'company', required: true, label: 'Company' },
            { id: 'major', type: 'position', required: true, label: 'Position' },
            { id: 'years_experience', type: 'yearsExp', required: true, label: 'Years of Experience' }
        ],
        descriptionFields: ['major'],
        localStorageFields: ['first_name', 'last_name', 'email'],
        campaignValue: 'Apply Executive MBA',
        retURL: 'https://www.aub.edu.lb/osb/Landing/Pages/EMBA-Apply-ThankYou.html'
    }
};

// Detect which page we're on
var currentPage = 'mba'; // default
if (window.location.pathname.indexOf('EMBA') > -1 ||
    document.title.indexOf('Executive MBA') > -1) {
    currentPage = 'emba';
}

var pageConfig = VALIDATOR_CONFIG[currentPage];