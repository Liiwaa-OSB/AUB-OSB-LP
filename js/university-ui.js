 $(document).ready(function () {
            // Populate university dropdown
            const uniSelect = document.getElementById('university');
            if (uniSelect && typeof populateUniversitySelect === 'function') {
                populateUniversitySelect(uniSelect, true);
            }

            // Create "Other" text input dynamically (hidden initially)
            const otherContainer = $('<div id="university-other-container" style="display:none; margin-top:10px;"></div>');
            const otherInput = $('<input type="text" id="UniversityOther" name="UniversityOther" class="input100" placeholder="Please specify your university">');
            otherContainer.append(otherInput);
            $('#university').after(otherContainer);

            // Toggle other input when "Other" is selected
            $('#university').on('change', function () {
                if ($(this).val() === 'Other') {
                    $('#university-other-container').show();
                    $('#UniversityOther').prop('required', true);
                } else {
                    $('#university-other-container').hide();
                    $('#UniversityOther').prop('required', false).val('');
                }
            });
        });