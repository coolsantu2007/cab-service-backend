module.exports = {
    checkValidation: async (checkParameter, checkValue) => {
        let obj = {
            error: false,
            errorMsg: ''
        }
        if (checkParameter == 'customer_name') {
            let chckNo = containsNumber(checkValue)
            if (chckNo) {
                obj.error = true
                obj.errorMsg = "Name should not contain Numeric Number"
                return obj
            }
            if (checkValue.length > 100) {
                obj.error = true
                obj.errorMsg ="Name should not be greater than 100 characters"
                return obj
            }

            let chckSpecialChar = specialCharacter(checkValue)
            if (chckSpecialChar) {
                obj.error = true
                obj.errorMsg = "No special character allowed in name"
                return obj
            }
        } else if (checkParameter == 'customer_mobile') {
            if (checkValue.length != 10) {
                obj.error = true
                obj.errorMsg = "Mobile number must be of 10 digits"
                return obj
            }
            if (!checkValue.startsWith('6') && !checkValue.startsWith('7') && !checkValue.startsWith('8') && !checkValue.startsWith('9')) {
                obj.error = true
                obj.errorMsg = "Mobile number should start with 6,7,8,9"
                return obj
            }
            let chckAlphabet = containsAlphabet(checkValue)
            if (chckAlphabet) {
                obj.error = true
                obj.errorMsg = "No alphabet allowed in mobile number"
                return obj
            }
        }else if (checkParameter == 'driver_name') {
            let chckNo = containsNumber(checkValue)
            if (chckNo) {
                obj.error = true
                obj.errorMsg = "Name should not contain Numeric Number"
                return obj
            }
            if (checkValue.length > 100) {
                obj.error = true
                obj.errorMsg ="Name should not be greater than 100 characters"
                return obj
            }

            let chckSpecialChar = specialCharacter(checkValue)
            if (chckSpecialChar) {
                obj.error = true
                obj.errorMsg = "No special character allowed in name"
                return obj
            }
        }else if (checkParameter == 'driver_mobile') {
            if (checkValue.length != 10) {
                obj.error = true
                obj.errorMsg = "Mobile number must be of 10 digits"
                return obj
            }
            if (!checkValue.startsWith('6') && !checkValue.startsWith('7') && !checkValue.startsWith('8') && !checkValue.startsWith('9')) {
                obj.error = true
                obj.errorMsg = "Mobile number should start with 6,7,8,9"
                return obj
            }
            let chckAlphabet = containsAlphabet(checkValue)
            if (chckAlphabet) {
                obj.error = true
                obj.errorMsg = "No alphabet allowed in mobile number"
                return obj
            }
        }
        return obj
    },

    checkBlank: async (string) => {
        if (!string) {
            let obj = {
                error: true,
                errorMsg: "Field cannot be empty"
            }
            return obj
        }
    },

    checkStringLength: async (string, minLength, maxLength) => {
        if (string.length < minLength || string.length > maxLength) {
            let obj = {
                error: true,
                errorMsg: `Character Length should be greater than ${minLength} and less than ${maxLength}`
            }
            return obj
        }
    }
}

function containsNumber(str) {
    return /\d/.test(str);
}

function containsAlphabet(number) {
    return !/^[0-9]+$/.test(number);
}

function specialCharacter(str) {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
}