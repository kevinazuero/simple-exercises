/**
 * SISTEMA DE VALIDACIÓN DE FORMULARIOS
 * ====================================
 * 
 * Sistema completo de validación para formularios web con las validaciones
 * más comunes utilizadas en aplicaciones reales.
 * 
 * Autor: Claude AI
 * Versión: 1.0
 * Fecha: 2025
 */

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.validators = new Map();
        this.errors = new Map();
        this.isSubmitting = false;
        
        this.init();
    }

    /**
     * Inicializa el validador
     */
    init() {
        this.setupValidators();
        this.bindEvents();
        this.setupCharacterCounter();
    }

    /**
     * Configura todos los validadores para cada campo
     */
    setupValidators() {
        // Nombre completo
        this.validators.set('fullName', {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            validate: (value) => this.validateFullName(value)
        });

        // Email
        this.validators.set('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            validate: (value) => this.validateEmail(value)
        });

        // Teléfono
        this.validators.set('phone', {
            required: true,
            validate: (value) => this.validatePhone(value)
        });

        // Fecha de nacimiento
        this.validators.set('birthDate', {
            required: true,
            validate: (value) => this.validateBirthDate(value)
        });

        // Cédula ecuatoriana
        this.validators.set('cedula', {
            required: true,
            validate: (value) => this.validateCedula(value)
        });

        // Contraseña
        this.validators.set('password', {
            required: true,
            validate: (value) => this.validatePassword(value)
        });

        // Confirmar contraseña
        this.validators.set('confirmPassword', {
            required: true,
            validate: (value) => this.validateConfirmPassword(value)
        });

        // Sitio web
        this.validators.set('website', {
            required: false,
            validate: (value) => this.validateWebsite(value)
        });

        // Salario
        this.validators.set('salary', {
            required: true,
            validate: (value) => this.validateSalary(value)
        });

        // País
        this.validators.set('country', {
            required: true,
            validate: (value) => this.validateSelect(value)
        });

        // Género
        this.validators.set('gender', {
            required: true,
            validate: () => this.validateRadioGroup('gender')
        });

        // Intereses
        this.validators.set('interests', {
            required: true,
            validate: () => this.validateCheckboxGroup('interests', 2)
        });

        // CV
        this.validators.set('cv', {
            required: true,
            validate: () => this.validateFile('cv')
        });

        // Comentarios
        this.validators.set('comments', {
            required: false,
            validate: (value) => this.validateTextarea(value)
        });

        // Términos
        this.validators.set('terms', {
            required: true,
            validate: () => this.validateCheckbox('terms')
        });
    }

    /**
     * Vincula eventos del formulario
     */
    bindEvents() {
        // Validación en tiempo real
        this.form.addEventListener('input', (e) => {
            if (e.target.name && this.validators.has(e.target.name)) {
                this.validateField(e.target.name);
            }
        });

        // Validación para radio buttons y checkboxes
        this.form.addEventListener('change', (e) => {
            if (e.target.type === 'radio' || e.target.type === 'checkbox') {
                if (this.validators.has(e.target.name)) {
                    this.validateField(e.target.name);
                }
            }
        });

        // Envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Reset del formulario
        this.form.addEventListener('reset', () => {
            this.clearAllErrors();
        });
    }

    /**
     * Configura contador de caracteres para textarea
     */
    setupCharacterCounter() {
        const commentsField = document.getElementById('comments');
        const counter = document.querySelector('.character-count');
        
        if (commentsField && counter) {
            commentsField.addEventListener('input', (e) => {
                const length = e.target.value.length;
                const maxLength = e.target.maxLength || 500;
                counter.textContent = `${length}/${maxLength} caracteres`;
                
                // Cambiar color si se acerca al límite
                if (length > maxLength * 0.9) {
                    counter.style.color = 'var(--error-color)';
                } else if (length > maxLength * 0.7) {
                    counter.style.color = 'var(--warning-color)';
                } else {
                    counter.style.color = 'var(--text-light)';
                }
            });
        }
    }

    // ===== VALIDADORES ESPECÍFICOS =====

    /**
     * Valida nombre completo
     */
    validateFullName(value) {
        if (!value.trim()) {
            return 'El nombre completo es requerido';
        }
        if (value.trim().length < 2) {
            return 'El nombre debe tener al menos 2 caracteres';
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            return 'El nombre solo puede contener letras y espacios';
        }
        if (value.trim().split(' ').length < 2) {
            return 'Debe ingresar nombre y apellido';
        }
        return null;
    }

    /**
     * Valida email
     */
    validateEmail(value) {
        if (!value.trim()) {
            return 'El email es requerido';
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            return 'Ingrese un email válido';
        }
        return null;
    }

    /**
     * Valida teléfono ecuatoriano
     */
    validatePhone(value) {
        if (!value.trim()) {
            return 'El teléfono es requerido';
        }
        
        // Limpiar el valor de espacios y caracteres especiales
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        
        // Validar formato ecuatoriano
        const ecuadorianPattern = /^(\+593|593|0)?[2-9]\d{8}$/;
        if (!ecuadorianPattern.test(cleanPhone)) {
            return 'Formato de teléfono ecuatoriano inválido';
        }
        
        return null;
    }

    /**
     * Valida fecha de nacimiento
     */
    validateBirthDate(value) {
        if (!value) {
            return 'La fecha de nacimiento es requerida';
        }
        
        const birthDate = new Date(value);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 100); // Máximo 100 años
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() - 18); // Mínimo 18 años
        
        if (birthDate > today) {
            return 'La fecha de nacimiento no puede ser futura';
        }
        if (birthDate < minDate) {
            return 'Fecha de nacimiento no válida';
        }
        if (birthDate > maxDate) {
            return 'Debe ser mayor de 18 años';
        }
        
        return null;
    }

    /**
     * Valida cédula ecuatoriana
     */
    validateCedula(value) {
        if (!value.trim()) {
            return 'La cédula es requerida';
        }
        
        const cedula = value.trim();
        
        // Debe tener exactamente 10 dígitos
        if (!/^\d{10}$/.test(cedula)) {
            return 'La cédula debe tener exactamente 10 dígitos';
        }
        
        // Algoritmo de validación de cédula ecuatoriana
        const digits = cedula.split('').map(Number);
        const province = parseInt(cedula.substring(0, 2));
        
        // Validar provincia
        if (province < 1 || province > 24) {
            return 'Código de provincia inválido';
        }
        
        // Validar dígito verificador
        const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let sum = 0;
        
        for (let i = 0; i < 9; i++) {
            let result = digits[i] * coefficients[i];
            if (result > 9) {
                result -= 9;
            }
            sum += result;
        }
        
        const verifierDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
        
        if (verifierDigit !== digits[9]) {
            return 'Número de cédula inválido';
        }
        
        return null;
    }

    /**
     * Valida contraseña segura
     */
    validatePassword(value) {
        if (!value) {
            return 'La contraseña es requerida';
        }
        
        if (value.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres';
        }
        
        if (!/[a-z]/.test(value)) {
            return 'La contraseña debe contener al menos una letra minúscula';
        }
        
        if (!/[A-Z]/.test(value)) {
            return 'La contraseña debe contener al menos una letra mayúscula';
        }
        
        if (!/\d/.test(value)) {
            return 'La contraseña debe contener al menos un número';
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            return 'La contraseña debe contener al menos un símbolo especial';
        }
        
        return null;
    }

    /**
     * Valida confirmación de contraseña
     */
    validateConfirmPassword(value) {
        const password = document.getElementById('password').value;
        
        if (!value) {
            return 'Debe confirmar la contraseña';
        }
        
        if (value !== password) {
            return 'Las contraseñas no coinciden';
        }
        
        return null;
    }

    /**
     * Valida sitio web
     */
    validateWebsite(value) {
        if (!value.trim()) {
            return null; // Campo opcional
        }
        
        const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        
        if (!urlPattern.test(value)) {
            return 'Ingrese una URL válida (ej: https://ejemplo.com)';
        }
        
        return null;
    }

    /**
     * Valida salario
     */
    validateSalary(value) {
        if (!value) {
            return 'El salario es requerido';
        }
        
        const salary = parseFloat(value);
        
        if (isNaN(salary)) {
            return 'Ingrese un valor numérico válido';
        }
        
        if (salary < 0) {
            return 'El salario no puede ser negativo';
        }
        
        if (salary > 1000000) {
            return 'El salario parece ser demasiado alto';
        }
        
        return null;
    }

    /**
     * Valida campos select
     */
    validateSelect(value) {
        if (!value || value === '') {
            return 'Debe seleccionar una opción';
        }
        return null;
    }

    /**
     * Valida grupo de radio buttons
     */
    validateRadioGroup(name) {
        const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
        const checked = Array.from(radioButtons).some(radio => radio.checked);
        
        if (!checked) {
            return 'Debe seleccionar una opción';
        }
        
        return null;
    }

    /**
     * Valida grupo de checkboxes con mínimo requerido
     */
    validateCheckboxGroup(name, minRequired = 1) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        if (checkedCount < minRequired) {
            return `Debe seleccionar al menos ${minRequired} opciones`;
        }
        
        return null;
    }

    /**
     * Valida archivo subido
     */
    validateFile(fieldName) {
        const fileInput = document.getElementById(fieldName);
        const file = fileInput.files[0];
        
        if (!file) {
            return 'Debe seleccionar un archivo';
        }
        
        // Validar tipo de archivo
        if (fieldName === 'cv' && file.type !== 'application/pdf') {
            return 'El archivo debe ser un PDF';
        }
        
        // Validar tamaño (5MB máximo)
        const maxSize = 5 * 1024 * 1024; // 5MB en bytes
        if (file.size > maxSize) {
            return 'El archivo no debe superar los 5MB';
        }
        
        return null;
    }

    /**
     * Valida textarea
     */
    validateTextarea(value) {
        if (value && value.length > 500) {
            return 'El comentario no debe superar los 500 caracteres';
        }
        return null;
    }

    /**
     * Valida checkbox individual
     */
    validateCheckbox(fieldName) {
        const checkbox = document.getElementById(fieldName);
        
        if (!checkbox.checked) {
            return 'Debe aceptar los términos y condiciones';
        }
        
        return null;
    }

    // ===== MÉTODOS DE VALIDACIÓN Y UI =====

    /**
     * Valida un campo específico
     */
    validateField(fieldName) {
        const validator = this.validators.get(fieldName);
        if (!validator) return true;

        let error = null;
        
        if (validator.validate) {
            // Usar validador personalizado
            const field = document.getElementById(fieldName) || 
                         document.querySelector(`input[name="${fieldName}"]`);
            const value = field ? field.value : '';
            error = validator.validate(value);
        }
        
        if (error) {
            this.showError(fieldName, error);
            return false;
        } else {
            this.clearError(fieldName);
            return true;
        }
    }

    /**
     * Muestra error en un campo
     */
    showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const formGroup = errorElement?.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        if (formGroup) {
            formGroup.classList.add('invalid');
            formGroup.classList.remove('valid');
        }
        
        this.errors.set(fieldName, message);
    }

    /**
     * Limpia error de un campo
     */
    clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const formGroup = errorElement?.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        if (formGroup) {
            formGroup.classList.remove('invalid');
            formGroup.classList.add('valid');
        }
        
        this.errors.delete(fieldName);
    }

    /**
     * Limpia todos los errores
     */
    clearAllErrors() {
        this.errors.clear();
        
        // Limpiar mensajes de error
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        // Limpiar clases de validación
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('valid', 'invalid');
        });
    }

    /**
     * Valida todo el formulario
     */
    validateForm() {
        let isValid = true;
        
        // Validar todos los campos
        for (const fieldName of this.validators.keys()) {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        }
        
        return isValid;
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        try {
            this.isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Validar formulario completo
            if (!this.validateForm()) {
                this.focusFirstError();
                return;
            }
            
            // Simular envío (aquí irían las llamadas al servidor)
            await this.simulateSubmission();
            
            // Mostrar mensaje de éxito
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            alert('Error al enviar el formulario. Por favor, inténtelo de nuevo.');
        } finally {
            this.isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    /**
     * Enfoca el primer campo con error
     */
    focusFirstError() {
        const firstErrorField = document.querySelector('.form-group.invalid input, .form-group.invalid select, .form-group.invalid textarea');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Simula el envío del formulario
     */
    async simulateSubmission() {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Aquí se enviarían los datos al servidor
        const formData = new FormData(this.form);
        console.log('Datos del formulario:', Object.fromEntries(formData));
    }

    /**
     * Muestra mensaje de éxito
     */
    showSuccessMessage() {
        const form = document.getElementById('registrationForm');
        const successMessage = document.getElementById('successMessage');
        
        if (form && successMessage) {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ===== MÉTODOS PÚBLICOS =====

    /**
     * Obtiene todos los errores actuales
     */
    getErrors() {
        return new Map(this.errors);
    }

    /**
     * Verifica si el formulario es válido
     */
    isValid() {
        return this.errors.size === 0;
    }

    /**
     * Obtiene los datos del formulario
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                // Si ya existe, convertir a array
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    /**
     * Resetea el formulario
     */
    reset() {
        this.form.reset();
        this.clearAllErrors();
        
        // Mostrar formulario si estaba oculto
        const form = document.getElementById('registrationForm');
        const successMessage = document.getElementById('successMessage');
        
        if (form && successMessage) {
            form.style.display = 'grid';
            successMessage.style.display = 'none';
        }
    }
}

// ===== INICIALIZACIÓN =====

/**
 * Inicializa el validador cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia del validador
    window.formValidator = new FormValidator('registrationForm');
    
    console.log('✅ Sistema de validación inicializado');
    console.log('📝 Campos configurados:', Array.from(window.formValidator.validators.keys()));
    
    // Exponer métodos globales para debugging
    window.validateForm = () => window.formValidator.validateForm();
    window.getFormData = () => window.formValidator.getFormData();
    window.getErrors = () => window.formValidator.getErrors();
    window.resetForm = () => window.formValidator.reset();
});