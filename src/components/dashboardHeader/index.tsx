"use client";

import { Search, Bell, ChevronDown, Menu } from "lucide-react";

interface DashboardHeaderProps {
    onMenuClick?: () => void;
}

const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
    return (
        <div 
            className="bg-white border-b border-[#E4E7EC] flex items-center justify-between"
            style={{
                height: '78px',
                paddingTop: '16px',
                paddingRight: '32px',
                paddingBottom: '16px',
                paddingLeft: '32px',
            }}
        >
            {/* Left Side - Menu, Search Icon, Search */}
            <div 
                className="flex items-center"
                style={{
                    height: '44px',
                    gap: '16px',
                    flex: '1',
                    maxWidth: '490px',
                }}
            >
                <button 
                    onClick={onMenuClick}
                    className="p-2 hover:bg-[#F9FAFB] rounded-lg lg:hidden"
                >
                    <Menu size={20} className="text-[#667085]" />
                </button>
                
                <div className="flex items-center gap-2 bg-[#F9FAFB] px-4 py-2 rounded-lg flex-1">
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 0.5H36C40.1421 0.5 43.5 3.85786 43.5 8V36C43.5 40.1421 40.1421 43.5 36 43.5H8C3.85786 43.5 0.5 40.1421 0.5 36V8C0.5 3.85786 3.85786 0.5 8 0.5Z" stroke="#E4E7EC"/>
<path d="M15.334 17.8333H28.6673M15.334 26.1667H28.6673M15.334 22H28.6673" stroke="#7D7F81" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8807 13.8807C16.4842 11.2772 16.4842 7.05612 13.8807 4.45262C11.2772 1.84913 7.05612 1.84913 4.45262 4.45262C1.84913 7.05612 1.84913 11.2772 4.45262 13.8807C7.05612 16.4842 11.2772 16.4842 13.8807 13.8807ZM13.8807 13.8807L17.5 17.5M6.2204 6.22039C7.84758 4.5932 10.4858 4.5932 12.113 6.22039" stroke="#7D7F81" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none 
                        text-[background: #B0B3B5] 
                        border-bottom: 1px solid #E4E7EC flex-1"
                    />
                    <div className="flex items-center gap-1 text-xs text-[#667085]">
                        
                        <svg width="45" height="22" viewBox="0 0 45 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_15279_9537)">
<rect x="0.769531" y="0.384613" width="20" height="20" rx="4.61538" fill="#E8E9ED" shape-rendering="crispEdges"/>
<path d="M9.61629 9.23076V8.07691C9.61629 7.43966 9.09969 6.92307 8.46244 6.92307C7.82519 6.92307 7.30859 7.43966 7.30859 8.07691C7.30859 8.71416 7.82519 9.23076 8.46244 9.23076H9.61629ZM9.61629 9.23076V11.5384M9.61629 9.23076H11.924M9.61629 11.5384V12.6923C9.61629 13.3295 9.09969 13.8461 8.46244 13.8461C7.82519 13.8461 7.30859 13.3295 7.30859 12.6923C7.30859 12.055 7.82519 11.5384 8.46244 11.5384H9.61629ZM9.61629 11.5384H11.924M11.924 11.5384H13.0778C13.7151 11.5384 14.2317 12.055 14.2317 12.6923C14.2317 13.3295 13.7151 13.8461 13.0778 13.8461C12.4406 13.8461 11.924 13.3295 11.924 12.6923V11.5384ZM11.924 11.5384V9.23076M11.924 9.23076V8.07691C11.924 7.43966 12.4406 6.92307 13.0778 6.92307C13.7151 6.92307 14.2317 7.43966 14.2317 8.07691C14.2317 8.71416 13.7151 9.23076 13.0778 9.23076H11.924Z" stroke="#7D7F81" stroke-width="1.2" stroke-linejoin="round"/>
</g>
<rect x="24.7695" y="0.384613" width="20" height="20" rx="4.61538" fill="#E8E9ED"/>
<path d="M31.2695 14.8846V5.88461H32.8393V10.0222H32.9439L36.3277 5.88461H38.2405L34.8916 9.92555L38.2695 14.8846H36.38L33.7986 11.0309L32.8393 12.2088V14.8846H31.2695Z" fill="#7D7F81"/>
<defs>
<filter id="filter0_d_15279_9537" x="0.000300467" y="-2.35438e-06" width="21.5385" height="21.5385" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.384615"/>
<feGaussianBlur stdDeviation="0.384615"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0 0.0705882 0 0 0 0.06 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15279_9537"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15279_9537" result="shape"/>
</filter>
</defs>
</svg>

                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* EN, Arrow-Down, Notification Bell, Profile Picture */}
                <div 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '46px',
                        gap: '12px',
                    }}
                >
                    <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '500', color: '#344054', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0' }}>
                        EN
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.3125 6.65625L9 11.3437L13.6875 6.65625" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    </button>
                    
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_15279_9551)">
<rect x="2" y="1" width="32" height="32" rx="8" fill="white" shape-rendering="crispEdges"/>
<rect x="2.5" y="1.5" width="31" height="31" rx="7.5" stroke="#E5E5E5" shape-rendering="crispEdges"/>
<path d="M16.0668 12.8502C16.0228 12.6853 15.9993 12.5121 15.9993 12.3333C15.9993 11.2288 16.8948 10.3333 17.9993 10.3333C19.1039 10.3333 19.9993 11.2288 19.9993 12.3333C19.9993 12.5121 19.9759 12.6853 19.9319 12.8502M16.0668 12.8502C16.6256 12.5229 17.2885 12.3333 17.9993 12.3333C18.7102 12.3333 19.3731 12.5229 19.9319 12.8502M16.0668 12.8502C16.021 12.877 15.9759 12.9047 15.9315 12.9334C14.998 13.536 14.3876 14.5355 14.3876 15.6667V16.0929C14.3876 17.1279 14.1265 18.1486 13.625 19.0743L12.7432 20.7019C12.5031 21.1451 12.8523 21.6667 13.3893 21.6667H15.9993M19.9319 12.8502C19.9777 12.877 20.0228 12.9047 20.0672 12.9334C21.0007 13.536 21.6111 14.5355 21.6111 15.6667V16.0929C21.6111 17.1279 21.8722 18.1486 22.3737 19.0743L23.2555 20.7019C23.4956 21.1451 23.1464 21.6667 22.6094 21.6667H19.9993M19.9993 21.6667C19.9993 22.7712 19.1039 23.6667 17.9993 23.6667C16.8948 23.6667 15.9993 22.7712 15.9993 21.6667M19.9993 21.6667H15.9993" stroke="#333436"/>
<g filter="url(#filter1_d_15279_9551)">
<circle cx="21" cy="13" r="2" fill="#FB3748"/>
<circle cx="21" cy="13" r="3" stroke="white" stroke-width="2"/>
</g>
</g>
<defs>
<filter id="filter0_d_15279_9551" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0 0.0705882 0 0 0 0.06 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15279_9551"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15279_9551" result="shape"/>
</filter>
<filter id="filter1_d_15279_9551" x="15" y="8" width="12" height="12" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0392157 0 0 0 0 0.0509804 0 0 0 0 0.0784314 0 0 0 0.03 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15279_9551"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15279_9551" result="shape"/>
</filter>
</defs>
</svg>

                    
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2F80ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '500', overflow: 'hidden' }}>
                        <img src="https://via.placeholder.com/48" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
                
                {/* Upgrade Now Button */}
                <button 
                    style={{
                        minWidth: '131px',
                        height: '46px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #2F80ED',
                        backgroundColor: '#FFFFFF',
                        color: '#2F80ED',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Upgrade Now
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
