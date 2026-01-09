/// <reference types="vite/client" />

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

// EmailJS configuration - bạn cần thay đổi các giá trị này
// Lấy từ https://dashboard.emailjs.com/admin
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_a7ixd56';
// Template auto-reply (gửi cho người dùng điền form)
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_17nvhcr';
// Template thông báo gửi về email của bạn (owner) - tùy chọn
const EMAILJS_OWNER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_OWNER_TEMPLATE_ID || 'template_7lzk2dd';
// Public key lấy trong Account → API keys → Public Key
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '5qmo2FFCXbyrB0jfQ';

// Khởi tạo EmailJS với public key
if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [emailCopied, setEmailCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Địa chỉ email chính của bạn để nhận thông báo
  const targetEmail = "thiephuc.ba@gmail.com";

  const handleEmailClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Try to copy email to clipboard
    try {
      // Sử dụng Clipboard API nếu có
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetEmail);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 3000);
        console.log('✅ Email đã được copy:', targetEmail);
      } else {
        // Fallback cho trình duyệt cũ
        const textArea = document.createElement('textarea');
        textArea.value = targetEmail;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 3000);
            console.log('✅ Email đã được copy (fallback):', targetEmail);
          } else {
            console.error('❌ Copy failed');
          }
        } catch (err) {
          console.error('❌ Fallback copy failed:', err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('❌ Failed to copy email:', err);
      // Vẫn hiển thị thông báo để người dùng biết
      alert(`Email: ${targetEmail}\n\nĐã tự động copy vào clipboard (nếu trình duyệt hỗ trợ).`);
    }
    
    // Delay một chút trước khi mở mailto: để đảm bảo copy đã hoàn thành
    setTimeout(() => {
      window.location.href = `mailto:${targetEmail}`;
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Debug: Log cấu hình EmailJS
    console.log('=== EmailJS Configuration Debug ===');
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('Public Key:', EMAILJS_PUBLIC_KEY ? `${EMAILJS_PUBLIC_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('Target Email:', targetEmail);
    console.log('Form Data:', formData);

    // Kiểm tra xem EmailJS đã được cấu hình chưa
    const isEmailJSConfigured = 
      EMAILJS_SERVICE_ID && 
      EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
      EMAILJS_TEMPLATE_ID && 
      EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
      EMAILJS_PUBLIC_KEY && 
      EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

    if (isEmailJSConfigured) {
      // Gửi email qua EmailJS
      try {
        // 1) Gửi email auto-reply cho người dùng (template Auto-Reply hiện tại)
        const templateParams = {
          // Biến cho template "Auto-Reply" (gửi email tới địa chỉ user nhập trong form)
          name: formData.name,          // {{name}}
          title: formData.message,      // {{title}}
          email: formData.email,        // {{email}} -> To Email (dùng cho template có {{email}})
          to_email: formData.email,     // {{to_email}} -> To Email (dùng cho template có {{to_email}})
          
          // Các biến bổ sung, dùng được cho template khác nếu cần
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          owner_email: targetEmail,     // email cá nhân của bạn (dùng cho template owner notification)
          reply_to: targetEmail,        // khi người nhận bấm Reply sẽ trả lời về email của bạn
        };

        console.log('Sending auto-reply with params:', templateParams);

        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        console.log('✅ EmailJS auto-reply success:', result);
        console.log('Status:', result.status);
        console.log('Text:', result.text);

        // 2) Gửi thêm một email thông báo về email cá nhân của bạn (owner), nếu đã cấu hình template
        if (EMAILJS_OWNER_TEMPLATE_ID && EMAILJS_OWNER_TEMPLATE_ID !== 'YOUR_OWNER_TEMPLATE_ID') {
          const ownerParams = {
            // Các biến cho "To Email" - hỗ trợ cả {{email}}, {{to_email}}, {{owner_email}}
            email: targetEmail,              // {{email}} -> To Email
            to_email: targetEmail,           // {{to_email}} -> To Email
            owner_email: targetEmail,        // {{owner_email}} -> To Email
            
            // Thông tin người gửi form
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            
            // Các biến bổ sung
            name: formData.name,
            title: formData.message,
            reply_to: formData.email,
          };

          console.log('📧 Sending owner notification with params:', ownerParams);
          console.log('📧 Owner Template ID:', EMAILJS_OWNER_TEMPLATE_ID);

          try {
            const ownerResult = await emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_OWNER_TEMPLATE_ID,
              ownerParams,
              EMAILJS_PUBLIC_KEY
            );
            console.log('✅ EmailJS owner notification success:', ownerResult);
            console.log('✅ Owner email sent to:', targetEmail);
          } catch (ownerError: any) {
            console.error('❌ Owner notification email failed:', ownerError);
            console.error('❌ Error details:', {
              status: ownerError.status,
              text: ownerError.text,
              message: ownerError.message
            });
            // Không phá vỡ trải nghiệm người dùng nếu email thông báo bị lỗi
            // Nhưng log chi tiết để debug
          }
        } else {
          console.warn('⚠️ Owner template ID chưa được cấu hình. Bỏ qua việc gửi email thông báo cho owner.');
          console.warn('⚠️ Để nhận email thông báo, hãy tạo template trong EmailJS và thêm VITE_EMAILJS_OWNER_TEMPLATE_ID vào .env');
        }
        
        setSubmitStatus('success');
        setFormSubmitted(true);
        // Reset form
        setFormData({ name: '', email: '', message: '' });
        
        setTimeout(() => {
          setFormSubmitted(false);
          setSubmitStatus('idle');
        }, 5000);
      } catch (error: any) {
        console.error('❌ EmailJS Error Details:', error);
        console.error('Error Status:', error.status);
        console.error('Error Text:', error.text);
        console.error('Full Error Object:', JSON.stringify(error, null, 2));
        
        // Xử lý các loại lỗi khác nhau
        let errorMsg = 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại.';
        
        if (error.text) {
          errorMsg = error.text;
        } else if (error.message) {
          errorMsg = error.message;
        } else if (typeof error === 'string') {
          errorMsg = error;
        }
        
        // Kiểm tra các lỗi phổ biến
        if (errorMsg.includes('recipients address is empty') || errorMsg.includes('recipient') && errorMsg.includes('empty')) {
          errorMsg = 'Lỗi: Địa chỉ email người nhận trống. Vui lòng kiểm tra template trong EmailJS Dashboard - phần "To Email" phải có {{email}}, {{to_email}} hoặc email cụ thể (ví dụ: thiephuc.ba@gmail.com)';
        } else if (errorMsg.includes('Account not found') || errorMsg.includes('Invalid public key')) {
          errorMsg = 'Cấu hình EmailJS không đúng. Vui lòng kiểm tra lại API keys trong file .env';
        } else if (errorMsg.includes('Service not found')) {
          errorMsg = 'Service ID không đúng. Vui lòng kiểm tra lại trong EmailJS dashboard';
        } else if (errorMsg.includes('Template not found')) {
          errorMsg = 'Template ID không đúng. Vui lòng kiểm tra lại trong EmailJS dashboard';
        } else if (error.status === 400) {
          errorMsg = `Lỗi 400: ${error.text || 'Dữ liệu không hợp lệ. Kiểm tra lại template variables trong EmailJS'}`;
        } else if (error.status === 403) {
          errorMsg = 'Lỗi 403: Không có quyền truy cập. Kiểm tra lại Public Key';
        } else if (error.status === 404) {
          errorMsg = 'Lỗi 404: Service hoặc Template không tìm thấy';
        }
        
        setSubmitStatus('error');
        setErrorMessage(errorMsg);
        
        // Fallback: copy to clipboard and try mailto
        fallbackToMailto();
      }
    } else {
      console.warn('⚠️ EmailJS chưa được cấu hình, sử dụng fallback');
      // Fallback: sử dụng mailto: và clipboard
      fallbackToMailto();
    }
    
    setIsSending(false);
  };

  const fallbackToMailto = async () => {
    const subject = `Portfolio Inquiry from ${formData.name}`;
    const emailContent = `To: ${targetEmail}\nSubject: ${subject}\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(emailContent);
      setFormSubmitted(true);
      setSubmitStatus('success');
      setTimeout(() => {
        setFormSubmitted(false);
        setSubmitStatus('idle');
      }, 5000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
    
    // Try to open mailto: link
    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
  };

  return (
    <div className="px-6 md:px-12 py-24 md:py-48 max-w-screen-xl mx-auto border-t border-white/5 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Side: Info */}
        <div className="lg:col-span-5 space-y-12 relative z-20">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
              Contact <br /> Form
            </h2>
            <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-sm">
              Please contact me directly at{' '}
              <span className="inline-flex items-center gap-2">
                <a 
                  href={`mailto:${targetEmail}`} 
                  className="text-white underline decoration-white/20 hover:decoration-white transition-all underline-offset-4 font-bold cursor-pointer pointer-events-auto relative z-30"
                >
                  {targetEmail}
                </a>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(targetEmail);
                        setEmailCopied(true);
                        setTimeout(() => setEmailCopied(false), 3000);
                        console.log('✅ Email đã được copy:', targetEmail);
                      } else {
                        // Fallback
                        const textArea = document.createElement('textarea');
                        textArea.value = targetEmail;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        textArea.style.top = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textArea);
                        if (successful) {
                          setEmailCopied(true);
                          setTimeout(() => setEmailCopied(false), 3000);
                        }
                      }
                    } catch (err) {
                      console.error('❌ Failed to copy:', err);
                      alert(`Email: ${targetEmail}`);
                    }
                  }}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer pointer-events-auto relative z-30"
                  title="Copy email"
                  aria-label="Copy email to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </span>
              {' '}or drop your info here.
              {emailCopied && (
                <span className="block mt-2 text-green-400 text-sm font-medium animate-pulse">
                  ✓ Email đã được copy vào clipboard!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 relative z-20">
          <form onSubmit={handleSubmit} className="space-y-10 pointer-events-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="mono text-[9px] uppercase tracking-[0.4em] opacity-30 font-bold">Full name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your Name"
                  className="w-full bg-white/[0.05] border border-white/10 p-5 rounded-md focus:outline-none focus:border-white/40 transition-colors text-sm placeholder:text-white/20"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="mono text-[9px] uppercase tracking-[0.4em] opacity-30 font-bold">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.05] border border-white/10 p-5 rounded-md focus:outline-none focus:border-white/40 transition-colors text-sm placeholder:text-white/20"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="mono text-[9px] uppercase tracking-[0.4em] opacity-30 font-bold">Your Message</label>
              <textarea 
                required
                rows={5}
                placeholder="Tell me about about your project,"
                className="w-full bg-white/[0.05] border border-white/10 p-5 rounded-md focus:outline-none focus:border-white/40 transition-colors text-sm resize-none placeholder:text-white/20"
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <p className="text-sm opacity-60 font-medium tracking-tight">
              I'll never share your data with anyone else. Pinky promise!
            </p>

            <button 
              type="submit"
              disabled={isSending}
              className="w-full bg-[#111] border border-white/10 text-white py-6 rounded-md font-bold text-base uppercase flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </>
              ) : (
                <>
              Send Message
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
                </>
              )}
            </button>
            
            {submitStatus === 'success' && formSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-md"
              >
                <p className="text-green-400 text-sm font-medium">
                  ✓ Email đã được gửi thành công! 
                  <br />
                  <span className="text-green-300/80 text-xs mt-1 block">
                    Tôi sẽ phản hồi sớm nhất có thể.
                  </span>
                </p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-md"
              >
                <p className="text-red-400 text-sm font-medium">
                  ✗ {errorMessage || 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại hoặc liên hệ trực tiếp qua email.'}
                </p>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
