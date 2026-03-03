import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

const SentimentPanel: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-pink-400">
        <Heart className="w-5 h-5" /> {t('customer_sentiment')}
      </h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        {t('sentiment_desc')}
      </p>

      <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="#334155" strokeWidth="8" fill="transparent" />
                  <circle cx="64" cy="64" r="60" stroke="#ec4899" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset="94" strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                  <div className="text-3xl font-bold text-white">75%</div>
                  <div className="text-[10px] text-slate-400 uppercase">{t('sentiment_score')}</div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
              <ThumbsUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-300">65%</div>
              <div className="text-[10px] text-slate-500">{t('positive')}</div>
          </div>
          <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
              <MessageSquare className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-300">20%</div>
              <div className="text-[10px] text-slate-500">{t('neutral')}</div>
          </div>
          <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
              <ThumbsDown className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-300">15%</div>
              <div className="text-[10px] text-slate-500">{t('negative')}</div>
          </div>
      </div>
    </div>
  );
};

export default SentimentPanel;
