'use client';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Egyptian Phone Number Validator
 * Accepts: 11 digits starting with 010, 011, 012, 015 (e.g. 01012345678 or +201012345678)
 */
export function validatePhone(phone: string, fieldName = 'رقم الهاتف'): ValidationResult {
  if (!phone || !phone.trim()) {
    return { isValid: false, message: `${fieldName} مطلوب` };
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
    return { isValid: false, message: `${fieldName} يجب أن يحتوي على أرقام فقط` };
  }

  // Check length
  if (cleaned.length !== 11) {
    return {
      isValid: false,
      message: `${fieldName} يجب أن يتكون من 11 رقماً (أنت أدخلت ${cleaned.length})`,
    };
  }

  // Check valid Egyptian mobile prefixes
  const validPrefixes = ['010', '011', '012', '015'];
  const prefix = cleaned.substring(0, 3);
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      message: `${fieldName} غير صالح، يجب أن يبدأ بـ (010, 011, 012, 015)`,
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Parent Phone Validator (cannot match student phone)
 */
export function validateParentPhone(parentPhone: string, studentPhone?: string): ValidationResult {
  const baseValidation = validatePhone(parentPhone, 'رقم ولي الأمر');
  if (!baseValidation.isValid) return baseValidation;

  if (studentPhone) {
    const cleanParent = parentPhone.replace(/[\s\-\(\)\+]/g, '');
    const cleanStudent = studentPhone.replace(/[\s\-\(\)\+]/g, '');
    if (cleanParent === cleanStudent) {
      return {
        isValid: false,
        message: 'لا يمكن أن يكون رقم ولي الأمر مطابقاً لرقم هاتف الطالب',
      };
    }
  }

  return { isValid: true, message: '' };
}

/**
 * Full Name Validator (requires at least 2 words / minimum 4 characters)
 */
export function validateFullName(name: string, isTeacher = false): ValidationResult {
  if (!name || !name.trim()) {
    return { isValid: false, message: 'الاسم بالكامل مطلوب' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 4) {
    return { isValid: false, message: 'الاسم قصير جداً (4 أحرف على الأقل)' };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return {
      isValid: false,
      message: isTeacher ? 'يرجى كتابة الاسم ثنائياً على الأقل' : 'يرجى كتابة الاسم ثلاثياً على الأقل',
    };
  }

  // Reject pure numbers or special symbols
  if (/[0-9<>{}\[\]\$\^\*\+=_~]/.test(trimmed)) {
    return { isValid: false, message: 'الاسم يجب أن لا يحتوي على أرقام أو رموز خاصة' };
  }

  return { isValid: true, message: '' };
}

/**
 * Password Validator (minimum 6 characters)
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, message: 'كلمة المرور مطلوبة' };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: `كلمة المرور يجب أن لا تقل عن 6 خانات (أنت أدخلت ${password.length})`,
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Email Validator (Optional or Required)
 */
export function validateEmail(email: string, required = false): ValidationResult {
  if (!email || !email.trim()) {
    if (required) {
      return { isValid: false, message: 'البريد الإلكتروني مطلوب' };
    }
    return { isValid: true, message: '' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      message: 'صيغة البريد الإلكتروني غير صحيحة (مثال: student@example.com)',
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Message / Textarea Validator
 */
export function validateMessage(message: string, minLength = 10, fieldName = 'الرسالة'): ValidationResult {
  if (!message || !message.trim()) {
    return { isValid: false, message: `${fieldName} مطلوبة` };
  }

  const trimmed = message.trim();
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} يجب أن تحتوي على ${minLength} أحرف على الأقل`,
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
  fieldName: string
): ValidationResult {
  const num = typeof val === 'string' ? parseFloat(val) : val;

  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName} يجب أن يكون رقماً صحيحاً` };
  }

  if (num < min || num > max) {
    return {
      isValid: false,
      message: `${fieldName} يجب أن يكون بين ${min} و ${max}`,
    };
  }

  return { isValid: true, message: '' };
}
