import React from 'react';

interface PaymentModalProps {
  type: 'success' | 'failed';
  onCancel: () => void;
  onPrimaryAction: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ type, onCancel, onPrimaryAction }) => {
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: '#f1f2f4' }}>
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-fadeIn"
        style={{
          width: '400px',
          height: '348px',
          opacity: 1,
          paddingTop: '32px',
          paddingBottom: '24px',
          paddingLeft: '32px',
          paddingRight: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`relative w-24 h-24 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
              {/* Petal effect */}
              <div className={`absolute inset-0 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full`} style={{
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              }}></div>
              
              {isSuccess ? (
<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z" fill="#FEF3F2"/>
<path d="M56.5283 54.8475C56.6386 54.9578 56.7262 55.0888 56.7859 55.233C56.8456 55.3771 56.8763 55.5316 56.8763 55.6877C56.8763 55.8437 56.8456 55.9982 56.7859 56.1424C56.7262 56.2865 56.6386 56.4175 56.5283 56.5278C56.418 56.6382 56.287 56.7257 56.1429 56.7854C55.9987 56.8451 55.8442 56.8758 55.6882 56.8758C55.5321 56.8758 55.3776 56.8451 55.2335 56.7854C55.0893 56.7257 54.9583 56.6382 54.848 56.5278L45.0007 46.679L35.1533 56.5278C34.9305 56.7507 34.6283 56.8758 34.3132 56.8758C33.998 56.8758 33.6958 56.7507 33.473 56.5278C33.2502 56.305 33.125 56.0028 33.125 55.6877C33.125 55.3726 33.2502 55.0703 33.473 54.8475L43.3218 45.0002L33.473 35.1528C33.2502 34.93 33.125 34.6278 33.125 34.3127C33.125 33.9976 33.2502 33.6953 33.473 33.4725C33.6958 33.2497 33.998 33.1245 34.3132 33.1245C34.6283 33.1245 34.9305 33.2497 35.1533 33.4725L45.0007 43.3213L54.848 33.4725C55.0708 33.2497 55.373 33.1245 55.6882 33.1245C56.0033 33.1245 56.3055 33.2497 56.5283 33.4725C56.7511 33.6953 56.8763 33.9976 56.8763 34.3127C56.8763 34.6278 56.7511 34.93 56.5283 35.1528L46.6795 45.0002L56.5283 54.8475Z" fill="#F04438"/>
</svg>


              ) : (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z" fill="#E7FEF8"/>
<path d="M51.7777 40.5973C51.8881 40.7076 51.9757 40.8386 52.0354 40.9828C52.0952 41.1269 52.1259 41.2814 52.1259 41.4375C52.1259 41.5936 52.0952 41.7481 52.0354 41.8922C51.9757 42.0364 51.8881 42.1674 51.7777 42.2777L43.4652 50.5902C43.3549 50.7006 43.2239 50.7882 43.0797 50.8479C42.9356 50.9077 42.7811 50.9384 42.625 50.9384C42.469 50.9384 42.3144 50.9077 42.1703 50.8479C42.0261 50.7882 41.8951 50.7006 41.7849 50.5902L38.2224 47.0277C37.9995 46.8048 37.8743 46.5026 37.8743 46.1875C37.8743 45.8724 37.9995 45.5702 38.2224 45.3473C38.4452 45.1245 38.7474 44.9993 39.0625 44.9993C39.3776 44.9993 39.6798 45.1245 39.9027 45.3473L42.625 48.0712L50.0973 40.5973C50.2076 40.4869 50.3386 40.3993 50.4828 40.3396C50.6269 40.2798 50.7815 40.2491 50.9375 40.2491C51.0936 40.2491 51.2481 40.2798 51.3922 40.3396C51.5364 40.3993 51.6674 40.4869 51.7777 40.5973ZM60.4375 45C60.4375 48.0532 59.5321 51.0379 57.8358 53.5766C56.1395 56.1153 53.7285 58.094 50.9077 59.2624C48.0868 60.4308 44.9829 60.7365 41.9883 60.1409C38.9937 59.5452 36.243 58.0749 34.084 55.916C31.9251 53.757 30.4548 51.0063 29.8591 48.0117C29.2635 45.0171 29.5692 41.9132 30.7376 39.0923C31.906 36.2715 33.8847 33.8605 36.4234 32.1642C38.9621 30.4679 41.9468 29.5625 45 29.5625C49.093 29.5668 53.017 31.1947 55.9112 34.0888C58.8053 36.983 60.4332 40.907 60.4375 45ZM58.0625 45C58.0625 42.4165 57.2964 39.891 55.8611 37.7429C54.4258 35.5947 52.3857 33.9205 49.9988 32.9318C47.6119 31.9432 44.9855 31.6845 42.4516 32.1885C39.9178 32.6925 37.5902 33.9366 35.7634 35.7634C33.9366 37.5902 32.6925 39.9178 32.1885 42.4516C31.6845 44.9855 31.9432 47.6119 32.9318 49.9988C33.9205 52.3857 35.5948 54.4257 37.7429 55.8611C39.891 57.2964 42.4165 58.0625 45 58.0625C48.4632 58.0586 51.7834 56.6811 54.2323 54.2322C56.6811 51.7834 58.0586 48.4632 58.0625 45Z" fill="#40C4AA"/>
</svg>

              )}
            </div>
          </div>

          {/* Title */}
          <h2 
            style={{
              width: '352px',
              height: '24px',
              opacity: 1,
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '120%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#000000',
              margin: '0 auto'
            }}
          >
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </h2>

          {/* Message */}
          <p 
            style={{
              width: '324px',
              height: '40px',
              opacity: 1,
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '140%',
              letterSpacing: '0.01em',
              textAlign: 'center',
              color: '#333436',
              margin: '8px auto 0'
            }}
          >
            {isSuccess
              ? 'Your payment has been processed successfully.Thank you!'
              : "Your payment couldn't be processed. Please try again."}
          </p>
        </div>

        {/* Buttons */}
        <div 
          style={{
            width: '352px',
            height: '42px',
            display: 'flex',
            justifyContent: 'space-between',
            opacity: 1,
            margin: '0 auto'
          }}
        >
          <button
            onClick={onCancel}
            style={{
              width: '82px',
              height: '42px',
              opacity: 1,
              paddingTop: '10px',
              paddingRight: '16px',
              paddingBottom: '10px',
              paddingLeft: '16px',
              gap: '8px',
              borderRadius: '6px',
              borderWidth: '1px',
              background: '#FFFFFF',
              border: '1px solid #2F80ED',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '140%',
              letterSpacing: '0.01em',
              textAlign: 'center',
              color: '#2F80ED',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onPrimaryAction}
            style={{
              height: '42px',
              opacity: 1,
              paddingTop: '10px',
              paddingRight: '16px',
              paddingBottom: '10px',
              paddingLeft: '16px',
              gap: '8px',
              borderRadius: '6px',
              background: '#2F80ED',
              border: 'none',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                width: '101px',
                height: '22px',
                opacity: 1,
                fontFamily: 'Inter Tight, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '140%',
                letterSpacing: '0.01em',
                textAlign: 'center',
                color: '#FFFFFF',
                display: 'inline-block'
              }}
            >
              {isSuccess ? 'Back to Home' : 'Try Again'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
