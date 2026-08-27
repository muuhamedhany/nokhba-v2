'use client';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Egyptian Phone Number Validator
 * Accepts: 11 digits starting with 010, 011, 012, 015 (e.g. 01012345678 or +201012345678)
 */
export function validatePhone(
  phone: string, 
  isArabic: boolean = true, 
  fieldName?: string
): ValidationResult {
  const defaultField = isArabic ? 'رقم الهاتف' : 'Phone number';
  const label = fieldName || defaultField;

  if (!phone || !phone.trim()) {
    return { 
      isValid: false, 
      message: isArabic ? `${label} مطلوب` : `${label} is required` 
    };
  }

  // Normalize: remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Handle +20 prefix
  if (cleaned.startsWith('+20')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('20') && cleaned.length === 12) {
    cleaned = '0' + cleaned.slice(2);
  } else if (cleaned.startsWith('0020')) {
    cleaned = '0' + cleaned.slice(4);
  }

  // Check if all digits
  if (!/^\d+$/.test(cleaned)) {
    return { 
      isValid: false, 
      message: isArabic 
        ? `${label} يجب أن يحتوي على أرقام فقط` 
        : `${label} must contain numbers only` 
    };
  }

  // Check length
  if (cleaned.length !== 11) {
    return {
      isValid: false,
      message: isArabic
        ? `${label} يجب أن يتكون من 11 رقماً (أنت أدخلت ${cleaned.length})`
        : `${label} must be 11 digits (you entered ${cleaned.length})`,
    };
  }

  // Check valid Egyptian mobile prefixes
  const validPrefixes = ['010', '011', '012', '015'];
  const prefix = cleaned.substring(0, 3);
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      message: isArabic
        ? `${label} غير صالح، يجب أن يبدأ بـ (010, 011, 012, 015)`
        : `${label} is invalid, must start with (010, 011, 012, 015)`,
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Parent Phone Validator (cannot match student phone)
 */
export function validateParentPhone(
  parentPhone: string, 
  studentPhone?: string, 
  isArabic: boolean = true
): ValidationResult {
  const baseValidation = validatePhone(
    parentPhone, 
    isArabic, 
    isArabic ? 'رقم هاتف ولي الأمر' : 'Parent phone number'
  );
  if (!baseValidation.isValid) return baseValidation;

  if (studentPhone) {
    const cleanParent = parentPhone.replace(/[\s\-\(\)\+]/g, '');
    const cleanStudent = studentPhone.replace(/[\s\-\(\)\+]/g, '');
    if (cleanParent === cleanStudent) {
      return {
        isValid: false,
        message: isArabic
          ? 'لا يمكن أن يكون رقم ولي الأمر مطابقاً لرقم هاتف الطالب'
          : 'Parent phone number cannot be identical to student phone number',
      };
    }
  }

  return { isValid: true, message: '' };
}

/**
 * Full Name Validator (requires at least 2 words / minimum 4 characters)
 */
export function validateFullName(
  name: string, 
  isTeacher: boolean = false, 
  isArabic: boolean = true
): ValidationResult {
  if (!name || !name.trim()) {
    return { 
      isValid: false, 
      message: isArabic ? 'الاسم بالكامل مطلوب' : 'Full name is required' 
    };
  }

  const trimmed = name.trim();

  if (trimmed.length < 4) {
    return { 
      isValid: false, 
      message: isArabic 
        ? 'الاسم قصير جداً (4 أحرف على الأقل)' 
        : 'Name is too short (at least 4 characters)' 
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return {
      isValid: false,
      message: isArabic
        ? (isTeacher ? 'يرجى كتابة الاسم ثنائياً على الأقل' : 'يرجى كتابة الاسم ثلاثياً على الأقل')
        : (isTeacher ? 'Please enter at least first and last name' : 'Please enter your full 3-part name'),
    };
  }

  // Reject pure numbers or special symbols
  if (/[0-9<>{}\[\]\$\^\*\+=_~]/.test(trimmed)) {
    return { 
      isValid: false, 
      message: isArabic 
        ? 'الاسم يجب أن لا يحتوي على أرقام أو رموز خاصة' 
        : 'Name must not contain numbers or special symbols' 
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Password Validator (minimum 6 characters)
 */
export function validatePassword(
  password: string, 
  isArabic: boolean = true
): ValidationResult {
  if (!password) {
    return { 
      isValid: false, 
      message: isArabic ? 'كلمة المرور مطلوبة' : 'Password is required' 
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: isArabic
        ? `كلمة المرور يجب أن لا تقل عن 6 خانات (أنت أدخلت ${password.length})`
        : `Password must be at least 6 characters (you entered ${password.length})`,
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Email Validator (Optional or Required)
 */
export function validateEmail(
  email: string, 
  required: boolean = false, 
  isArabic: boolean = true
): ValidationResult {
  if (!email || !email.trim()) {
    if (required) {
      return { 
        isValid: false, 
        message: isArabic ? 'البريد الإلكتروني مطلوب' : 'Email address is required' 
      };
    }
    return { isValid: true, message: '' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      message: isArabic
        ? 'صيغة البريد الإلكتروني غير صحيحة (مثال: student@example.com)'
        : 'Invalid email address format (e.g. student@example.com)',
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Message / Textarea Validator
 */
export function validateMessage(
  message: string, 
  minLength: number = 10, 
  isArabic: boolean = true, 
  fieldName?: string
): ValidationResult {
  const defaultLabel = isArabic ? 'الرسالة' : 'Message';
  const label = fieldName || defaultLabel;

  if (!message || !message.trim()) {
    return { 
      isValid: false, 
      message: isArabic ? `${label} مطلوبة` : `${label} is required` 
    };
  }

  const trimmed = message.trim();
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      message: isArabic
        ? `${label} يجب أن تحتوي على ${minLength} أحرف على الأقل`
        : `${label} must be at least ${minLength} characters`,
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Positive Numeric Validator (for code counts, prices, etc.)
 */
export function validateNumberRange(
  val: number | string,
  min: number,
  max: number,
  isArabic: boolean = true,
  fieldName?: string
): ValidationResult {
  const defaultLabel = isArabic ? 'القيمة' : 'Value';
  const label = fieldName || defaultLabel;
  const num = typeof val === 'string' ? parseFloat(val) : val;

  if (isNaN(num)) {
    return { 
      isValid: false, 
      message: isArabic ? `${label} يجب أن يكون رقماً صحيحاً` : `${label} must be a valid number` 
    };
  }

  if (num < min || num > max) {
    return {
      isValid: false,
      message: isArabic
        ? `${label} يجب أن يكون بين ${min} و ${max}`
        : `${label} must be between ${min} and ${max}`,
    };
  }

  return { isValid: true, message: '' };
}
