import fs from 'fs';
import path from 'path';

export interface ContactFormTexts {
  modalTitle: string;
  labels: {
    name: string;
    email: string;
    company: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    company: string;
    message: string;
  };
  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
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
          if (key.trim() === 'title') {
            texts.modalTitle = value;
          }
          break;
        case 'labels':
          if (!texts.labels) texts.labels = {} as any;
          texts.labels[key.trim() as keyof typeof texts.labels] = value;
          break;
        case 'placeholders':
          if (!texts.placeholders) texts.placeholders = {} as any;
          texts.placeholders[key.trim() as keyof typeof texts.placeholders] = value;
          break;
        case 'errormessages':
          if (!texts.errors) texts.errors = {} as any;
          texts.errors[key.trim() as keyof typeof texts.errors] = value;
          break;
        case 'successmessages':
          if (!texts.success) texts.success = {} as any;
          texts.success[key.trim() as keyof typeof texts.success] = value;
          break;
        case 'apimessages':
          if (!texts.api) texts.api = {} as any;
          texts.api[key.trim() as keyof typeof texts.api] = value;
          break;
      }
    }
  }
  
  return texts as ContactFormTexts;
}
