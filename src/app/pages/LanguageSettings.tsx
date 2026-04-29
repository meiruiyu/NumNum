import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check } from 'lucide-react';

/* =========================================================================
 *  Language Settings
 *  Only English is enabled in this milestone — the other languages are
 *  intentionally shown as disabled ("Coming soon") so the concept of
 *  translation is visible without expanding scope beyond the team.
 * ========================================================================= */

interface Language {
  id: string;
  name: string;
  nativeName: string;
  enabled: boolean;
}

export function LanguageSettings() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const languages: Language[] = [
    { id: 'english',             name: 'English',              nativeName: 'English',  enabled: true  },
    { id: 'simplified-chinese',  name: 'Simplified Chinese',   nativeName: '简体中文',  enabled: false },
    { id: 'traditional-chinese', name: 'Traditional Chinese',  nativeName: '繁體中文',  enabled: false },
    { id: 'japanese',            name: 'Japanese',             nativeName: '日本語',    enabled: false },
    { id: 'korean',              name: 'Korean',               nativeName: '한국어',    enabled: false },
    { id: 'thai',                name: 'Thai',                 nativeName: 'ภาษาไทย',  enabled: false },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#F0EBE3] px-4 py-4">
        <div className="flex items-center justify-center relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-1"
            aria-label="Back"
          >
            <ArrowLeft className="size-5 text-[#2C1A0E]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#2C1A0E]">Language</h1>
        </div>
      </div>

      {/* Subtitle */}
      <div className="px-4 py-4">
        <p className="text-[13px] text-[#8A8078] leading-relaxed">
          The app interface stays in English. Your language preference is used for
          menu translations and search. Additional languages will be available in a
          future update.
        </p>
      </div>

      {/* Language List */}
      <div className="bg-white">
        {languages.map((language) => {
          const isSelected = selectedLanguage === language.id;
          const isDisabled = !language.enabled;
          return (
            <button
              key={language.id}
              onClick={() => {
                if (!isDisabled) setSelectedLanguage(language.id);
              }}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              className={`w-full flex items-center justify-between px-4 h-[60px] border-b border-[#F0EBE3] last:border-0 transition-colors ${
                isDisabled
                  ? 'cursor-not-allowed bg-white'
                  : 'hover:bg-[#FDF6EE]'
              }`}
            >
              <div className="flex-1 text-left">
                <div
                  className={`text-[15px] font-semibold mb-0.5 ${
                    isDisabled ? 'text-[#B4B2A9]' : 'text-[#2C1A0E]'
                  }`}
                >
                  {language.name}
                </div>
                <div
                  className={`text-xs ${
                    isDisabled ? 'text-[#C6C0B8]' : 'text-[#8A8078]'
                  }`}
                >
                  {language.nativeName}
                </div>
              </div>

              {isDisabled ? (
                <span className="flex-shrink-0 text-[11px] font-medium text-[#B4B2A9] bg-[#F5F0EB] px-2 py-1 rounded-full">
                  Coming soon
                </span>
              ) : (
                isSelected && (
                  <div className="size-6 rounded-full bg-[#E8603C] flex items-center justify-center flex-shrink-0">
                    <Check className="size-4 text-white" strokeWidth={3} />
                  </div>
                )
              )}
            </button>
          );
        })}
      </div>

      {/* Note */}
      <div className="px-6 py-4">
        <p className="text-xs text-[#8A8078] text-center leading-relaxed">
          Your language preference is used for menu translations and dish name display.
        </p>
      </div>
    </div>
  );
}
