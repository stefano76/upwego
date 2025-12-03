import fs from 'fs';
import path from 'path';

export interface ContactFormTexts {
  modalTitle: {
    title: string;
    subtitle?: string;
    paragraph?: string;
  };
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    privacyRequired: string;
  };
  success: {
    formSuccess: string;
    submitButton: string;
    submitButtonLoading: string;
  };
  api: {
    serverError: string;
    networkError: string;
  };
  privacy: {
    label: string;
    linkText: string;
    linkUrl: string;
  };
}

export function getContactFormTexts(): ContactFormTexts {
  const filePath = path.join(process.cwd(), 'content', 'contact-form-texts.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  // Parse the markdown content
  const lines = fileContents.split('\n');
  const texts: Partial<ContactFormTexts> = {};
  
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('##')) {
      // This is a section header
      currentSection = trimmedLine.replace(/^##\s*/, '').toLowerCase().replace(/\s+/g, '');
    } else if (trimmedLine.startsWith('-') && trimmedLine.includes(':')) {
      // This is a key-value pair
      const content = trimmedLine.replace(/^-\s*/, '');
      const [key, ...valueParts] = content.split(':');
      const value = valueParts.join(':').trim();
      
      switch (currentSection) {
        case 'modaltitle':
          if (!texts.modalTitle) texts.modalTitle = { title: '', subtitle: '', paragraph: '' };
          const modalKey = key.trim() as keyof typeof texts.modalTitle;
          if (modalKey === 'title' || modalKey === 'subtitle' || modalKey === 'paragraph') {
            texts.modalTitle[modalKey] = value;
          }
          break;
        case 'labels':
          if (!texts.labels) texts.labels = { name: '', email: '', phone: '', message: '' };
          const labelKey = key.trim() as keyof typeof texts.labels;
          if (texts.labels[labelKey] !== undefined) {
            texts.labels[labelKey] = value;
          }
          break;
        case 'placeholders':
          if (!texts.placeholders) texts.placeholders = { name: '', email: '', phone: '', message: '' };
          const placeholderKey = key.trim() as keyof typeof texts.placeholders;
          if (texts.placeholders[placeholderKey] !== undefined) {
            texts.placeholders[placeholderKey] = value;
          }
          break;
        case 'errormessages':
          if (!texts.errors) texts.errors = { nameRequired: '', emailRequired: '', emailInvalid: '', messageRequired: '', privacyRequired: '' };
          const errorKey = key.trim() as keyof typeof texts.errors;
          if (texts.errors[errorKey] !== undefined) {
            texts.errors[errorKey] = value;
          }
          break;
        case 'successmessages':
          if (!texts.success) texts.success = { formSuccess: '', submitButton: '', submitButtonLoading: '' };
          const successKey = key.trim() as keyof typeof texts.success;
          if (texts.success[successKey] !== undefined) {
            texts.success[successKey] = value;
          }
          break;
        case 'apimessages':
          if (!texts.api) texts.api = { serverError: '', networkError: '' };
          const apiKey = key.trim() as keyof typeof texts.api;
          if (texts.api[apiKey] !== undefined) {
            texts.api[apiKey] = value;
          }
          break;
        case 'privacycheckbox':
          if (!texts.privacy) texts.privacy = { label: '', linkText: '', linkUrl: '' };
          const privacyKey = key.trim() as keyof typeof texts.privacy;
          if (texts.privacy[privacyKey] !== undefined) {
            texts.privacy[privacyKey] = value;
          }
          break;
      }
    }
  }
  
  return texts as ContactFormTexts;
}
