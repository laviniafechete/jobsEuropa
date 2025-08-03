import soap from 'soap';
import config from '../config.js';

class SMSService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.client = await soap.createClientAsync(config.web2sms.wsdlUrl);
      this.initialized = true;
      console.log('✅ Web2SMS SOAP client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Web2SMS client:', error);
      throw error;
    }
  }

  async sendSMS(phoneNumber, message, options = {}) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!config.web2sms.username || !config.web2sms.authKey) {
        throw new Error('Web2SMS credentials not configured');
      }

      // Normalize phone number (remove spaces, +, and ensure correct format)
      const normalizedPhone = this.normalizePhoneNumber(phoneNumber);

      const params = {
        username: config.web2sms.username,
        authKey: config.web2sms.authKey,
        sender: options.sender || config.web2sms.sender,
        recipient: normalizedPhone,
        message: message,
        scheduleDate: options.scheduleDate || null,
        validity: options.validity || null,
        callbackUrl: options.callbackUrl || null,
        userData: options.userData || null
      };

      console.log('📱 Sending SMS to:', normalizedPhone);
      console.log('📝 Message:', message);

      const result = await this.client.sendSmsAuthKeyAsync(params);
      
      if (result && result[0]) {
        console.log('✅ SMS sent successfully, MessageID:', result[0]);
        return {
          success: true,
          messageId: result[0],
          phoneNumber: normalizedPhone
        };
      } else {
        throw new Error('Invalid response from Web2SMS');
      }

    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      
      // Extract error code and message from SOAP fault
      let errorCode = null;
      let errorMessage = error.message;
      
      if (error.root && error.root.Envelope && error.root.Envelope.Body && error.root.Envelope.Body.Fault) {
        const fault = error.root.Envelope.Body.Fault;
        errorCode = fault.faultcode;
        errorMessage = fault.faultstring;
      }

      return {
        success: false,
        error: errorMessage,
        errorCode: errorCode,
        phoneNumber: phoneNumber
      };
    }
  }

  normalizePhoneNumber(phoneNumber) {
    if (!phoneNumber) throw new Error('Phone number is required');

    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Romanian phone number normalization
    if (cleaned.startsWith('40')) {
      // +40 prefix, keep as is
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      // 07XXXXXXXX format, convert to 407XXXXXXXX
      return '40' + cleaned.substring(1);
    } else if (cleaned.length === 9 && cleaned.startsWith('7')) {
      // 7XXXXXXXX format, convert to 407XXXXXXXX
      return '40' + cleaned;
    } else if (cleaned.length === 10 && cleaned.startsWith('07')) {
      // Remove leading 0 and add 40
      return '40' + cleaned.substring(1);
    }

    // For international numbers, return as is if valid
    return cleaned;
  }

  async sendVerificationCode(phoneNumber, userData = null) {
    const code = this.generateVerificationCode();
    const message = `Codul tau de verificare pentru Jobs Europa este: ${code}. Nu distribui acest cod nimanui.`;
    
    const result = await this.sendSMS(phoneNumber, message, {
      userData: userData || `verification_${phoneNumber}`,
      validity: 10 // 10 minutes validity
    });

    return {
      ...result,
      verificationCode: result.success ? code : null
    };
  }

  async sendPasswordResetCode(phoneNumber, userData = null) {
    const code = this.generateVerificationCode();
    const message = `Codul pentru resetarea parolei Jobs Europa: ${code}. Valabil 10 minute.`;
    
    const result = await this.sendSMS(phoneNumber, message, {
      userData: userData || `password_reset_${phoneNumber}`,
      validity: 10 // 10 minutes validity
    });

    return {
      ...result,
      resetCode: result.success ? code : null
    };
  }

  async sendJobApplicationNotification(phoneNumber, jobTitle, companyName, userData = null) {
    const message = `Aplicatia ta la "${jobTitle}" de la ${companyName} a fost trimisa cu succes! Vei fi contactat daca profilul tau este selectat.`;
    
    return await this.sendSMS(phoneNumber, message, {
      userData: userData || `job_application_${phoneNumber}`
    });
  }

  async sendSubscriptionNotification(phoneNumber, subscriptionType, userData = null) {
    const message = `Abonamentul tau ${subscriptionType} pentru Jobs Europa a fost activat cu succes! Poti posta joburi si vizualiza candidati.`;
    
    return await this.sendSMS(phoneNumber, message, {
      userData: userData || `subscription_${phoneNumber}`
    });
  }

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }

  // Get error message based on Web2SMS error codes
  getErrorMessage(errorCode) {
    const errorMessages = {
      '0x20000001': 'Eroare internă Web2SMS',
      '0x10000001': 'Nu există cont disponibil pentru IP-ul curent',
      '0x10000007': 'Contul asociat este dezactivat',
      '0x10000006': 'Contul asociat este configurat greșit',
      '0x10000008': 'Eroare internă la crearea expeditorului SMS',
      '0x10000002': 'Numărul de telefon are format greșit sau aparține unei rețele neconfigure',
      '0x1000000a': 'Numărul de telefon este în lista neagră',
      '0x10000040': 'Numărul aparține unei rețele GSM neconfigure pentru cont',
      '0x10000004': 'Ai depășit limita lunară de trimitere SMS-uri',
      '0x10000020': 'Încerci să programezi un SMS în afara intervalului permis',
      '0x10000003': 'Mesajul este gol! Mesajele goale nu sunt permise',
      '0x10000009': 'Eroare internă la programarea SMS-ului'
    };

    return errorMessages[errorCode] || 'Eroare necunoscută la trimiterea SMS-ului';
  }
}

// Create singleton instance
const smsService = new SMSService();

export default smsService; 