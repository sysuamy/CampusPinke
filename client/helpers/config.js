/**
 * Created by Kira on 7/16/15.
 */

/**
 * Created by Kira on 7/16/15.
 */

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL_CONFIRM',
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'nickname',
        fieldLabel: 'Nick name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
            if (!value) {
                errorFunction("Please write your Nick name");
                return false;
            } else {
                return true;
            }
        }
    }, {
        fieldName: 'gender',
        showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        fieldLabel: 'Gender',
        inputType: 'radio',
        radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
        data: [{                    // Array of radio options, all properties are required
            id: 1,                  // id suffix of the radio element
            label: 'Male',          // label for the radio element
            value: 'm',              // value of the radio element, this will be saved.
            checked: 'checked'
        }, {
            id: 2,
            label: 'Female',
            value: 'f'
        }],
        visible: true
    }, {
        fieldName: 'school',
        fieldLabel: 'School',
        inputType: 'select',
        showFieldLabel: true,
        empty: 'Please select your country of residence',
        data: [{
            id: 1,
            label: '中山大学',
            value: 'SYSU'
        }, {
            id: 2,
            label: '广东外语外贸大学',
            value: 'GY'
        }],
        visible: true
    }, {
        fieldName: 'terms',
        fieldLabel: 'I accept the terms and conditions',
        inputType: 'checkbox',
        visible: true,
        saveToProfile: false,
        validate: function(value, errorFunction) {
            if (value) {
                return true;
            } else {
                errorFunction('You must accept the terms and conditions.');
                return false;
            }
        }
    }]
});