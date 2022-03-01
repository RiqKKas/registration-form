class Validator {
    constructor() {
        this.validations = [
            'data-required',
            'data-length',
            'data-email-validate',
            'data-cpf-validate',
            'data-only-letters',
            'data-password-validate',
            'data-equal',
            'data-checked'
        ];
    }

    validate(form) {
        const currentsValidations = document.querySelectorAll('form .error-validation');
        if (currentsValidations.length > 0) this.cleanValidations(currentsValidations);
        let isValid = false;

        const inputs = Array.from(form.getElementsByTagName('input'));
        inputs.forEach((input) => {
            for (let i in this.validations) {
                if (input.getAttribute(this.validations[i]) !== null) {
                    const method = this.validations[i].replace('data-', '').replace('-', '');
                    const attributeValue = input.getAttribute(this.validations[i]);
                    isValid = this[method](input, attributeValue);
                }
            }
        });

        return isValid;
    }

    length(input, currentValue) {
        const inputLength = input.value.length;
        const minValue = parseInt(currentValue.substring(0, 1));
        const maxValue = parseInt(currentValue.substring(2, inputLength - 1));

        if (inputLength < minValue) {
            const errorMessage = `O campo precisar ter pelo menos ${minValue} caracteres.`;
            this.printMessage(input, errorMessage);
            return false;
        } else if (inputLength > maxValue) {
            const errorMessage = `O campo não pode ultrapassar o comprimento de ${maxValue} caracteres.`;
            this.printMessage(input, errorMessage);
            return false;
        }

        return true;
    }

    onlyletters(input) {
        const regex = /^[A-Za-z]+$/;
        if (!regex.test(input.value)) {
            const errorMessage = 'Este campo não aceita números nem caracteres especiais.';
            this.printMessage(input, errorMessage);
            return false;
        }
        return true;
    }

    emailvalidate(input) {
        const regex = /\S+@\S+\.\S+/;
        if (!regex.test(input.value)) {
            const errorMessage = 'Insira um e-mail no padrão fulado@gmail.com';
            this.printMessage(input, errorMessage);
            return false;
        }
        return true;
    }

    cpfvalidate(input) {
        const isSequence = (cpf) => {
            const sequence = cpf[0].repeat(cpf.length);
            return sequence === cpf;
        }

        const createDigit = (partialCpf) => {
            const cpfArray = Array.from(partialCpf);
            let regressive = cpfArray.length + 1;
            let digit = cpfArray.reduce((accumulator, value) => {
                accumulator += (regressive * Number(value));
                regressive--;
                return accumulator;
            }, 0);

            digit = 11 - (digit % 11);
            return digit > 9 ? '0' : String(digit);
        }

        const cpf = input.value.replace(/\D+/g, '');
        if (cpf.length !== 11) return false;
        if (isSequence(cpf)) return false;

        const partialCpf = cpf.slice(0, -2);
        const penultimateDigit = createDigit(partialCpf);
        const lastDigit = createDigit(partialCpf + penultimateDigit);
        const confirmationCpf = partialCpf + penultimateDigit + lastDigit;

        if (cpf !== confirmationCpf) {
            const errorMessage = 'CPF inválido.';
            this.printMessage(input, errorMessage);
            return false;
        }
        return true;
    }

    passwordvalidate(input) {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
        if (!regex.test(input.value)) {
            const errorMessage = 'A senha precisa conter pelo menos um caractere maiúsculo e um número.';
            this.printMessage(input, errorMessage);
            return false;
        }
        return true;
    }

    equal(input, inputName) {
        const inputToCompare = document.getElementsByName(inputName)[0];
        if (input.value !== inputToCompare.value) {
            const errorMessage = 'As senhas devem ser iguais.';
            this.printMessage(input, errorMessage);
            return false;
        }
        return true;
    }

    checked(input) {
        if(!input.checked) {
            const errorMessage = 'É necessário marcar este campo.';
            this.printMessage(input, errorMessage);
            return false;
        }
        return true;
    }

    required(input) {
        if (input.value === '') {
            const errorMessage = 'Este campo é obrigatório.';
            this.printMessage(input, errorMessage);
            return false;
        }
        return true;
    }

    printMessage(input, msg) {
        const existingError = input.parentNode.querySelector('.error-validation');

        if (existingError === null) {
            const template = document.querySelector('.error-validation').cloneNode(true);
            template.textContent = msg;
            template.classList.remove('template');

            const inputParent = input.parentNode;
            inputParent.appendChild(template);
        }
    }

    cleanValidations(validations) {
        validations.forEach(element => element.remove());
    }
}

const form = document.getElementById('register-form');
const submitBottom = document.getElementById('btn-submit');

const validator = new Validator();

submitBottom.addEventListener('click', (event) => {
    event.preventDefault();
    validator.validate(form);
});