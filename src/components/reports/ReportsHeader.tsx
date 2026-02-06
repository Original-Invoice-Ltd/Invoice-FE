import { useTranslation } from "react-i18next";

const ReportsHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div 
      className="flex flex-col sm:flex-row sm:items-start mb-6 w-full"
      style={{
        maxWidth: '1108px',
        height: '48px',
        justifyContent: 'space-between',
        opacity: 1
      }}
    >
      <div className="flex flex-col gap-1">
        <h1 
          style={{ 
            width: '360px',
            height: '24px',
            opacity: 1,
            fontFamily: 'Inter Tight',
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '120%',
            letterSpacing: '0%',
            color: '#000000'
          }}>
          {t('reports_analytics')}
        </h1>
        <p 
          style={{ 
            width: '360px',
            height: '20px',
            opacity: 1,
            fontFamily: 'Inter Tight',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '140%',
            letterSpacing: '1%',
            color: '#333436'
          }}>
          {t('see_business_performance')}
        </p>
      </div>
      
      <div className="flex" style={{ gap: '8px' }}>
        <button 
          className="flex items-center justify-center transition-colors"
          style={{
            width: '106px',
            height: '48px',
            borderRadius: '8px',
            opacity: 1,
            gap: '8px',
            paddingTop: '12px',
            paddingRight: '16px',
            paddingBottom: '12px',
            paddingLeft: '16px',
            background: 'var(--Background-Primary, #FFFFFF)',
            border: '1px solid var(--Button-Outline, #2F80ED)',
            color: '#2F80ED'
          }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 12L20 4M20 4H15M20 4V9M11 4H7C5.34315 4 4 5.34315 4 7V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V13" stroke="#2F80ED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          {t('share')}
        </button>
        <button 
          className="flex items-center justify-center text-white transition-colors"
          style={{
            width: '112px',
            height: '48px',
            borderRadius: '8px',
            opacity: 1,
            gap: '8px',
            paddingTop: '12px',
            paddingRight: '16px',
            paddingBottom: '12px',
            paddingLeft: '16px',
            background: 'var(--Button-Primary-Base, #2F80ED)'
          }}>
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 20V4M12 20L6 14M12 20L18 14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          {t('export')}
        </button>
      </div>
    </div>
  );
};

export default ReportsHeader;
