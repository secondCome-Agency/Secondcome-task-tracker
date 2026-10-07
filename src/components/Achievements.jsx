import React from 'react';
import { Lock } from 'lucide-react';

export default function Achievements({ achievements }) {
  if (!achievements || achievements.length === 0) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
            Achievements
          </h3>
          <p className="text-xs text-slate-400">
            Earn badges as you build consistent habits
          </p>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
          {unlockedCount} / {achievements.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`
              flex items-start gap-3 p-3 rounded-lg border transition-all
              ${item.unlocked 
                ? 'bg-slate-800/80 border-indigo-500/30 text-slate-100 shadow-xs' 
                : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'}
            `}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-xl
              ${item.unlocked ? 'bg-indigo-950/80 border border-indigo-500/40' : 'bg-slate-800/50 border border-slate-700/50'}
            `}>
              {item.unlocked ? item.icon : <Lock size={16} className="text-slate-500" />}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold ${item.unlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
