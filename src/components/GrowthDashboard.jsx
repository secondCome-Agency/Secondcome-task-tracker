import React, { useState } from 'react';
import { TrendingUp, Award, CheckCircle2, Flame, BarChart3, Users, Calendar } from 'lucide-react';
import { formatRelativeDateLabel } from '../utils/dateUtils';

export default function GrowthDashboard({ members, allTasks, selectedDateKey, selectedDateTasks }) {
  const [scope, setScope] = useState('selectedDate'); // 'selectedDate' | 'allTime'

  const relativeDateTitle = formatRelativeDateLabel(selectedDateKey);

  // Compute stats per member based on scope
  const memberGrowthData = members.map(member => {
    const memberTasks = scope === 'selectedDate'
      ? selectedDateTasks.filter(t => (t.memberId || 'member-1') === member.id)
      : allTasks.filter(t => (t.memberId || 'member-1') === member.id);

    const total = memberTasks.length;
    const completed = memberTasks.filter(t => t.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Categories breakdown
    const categoriesMap = {};
    memberTasks.forEach(t => {
      const cat = t.category || 'General';
      if (!categoriesMap[cat]) categoriesMap[cat] = { total: 0, completed: 0 };
      categoriesMap[cat].total += 1;
      if (t.completed) categoriesMap[cat].completed += 1;
    });

    // Streak calculation for member
    const dateMap = {};
    const memberAllTasks = allTasks.filter(t => (t.memberId || 'member-1') === member.id);
    memberAllTasks.forEach(t => {
      if (!dateMap[t.date]) dateMap[t.date] = { total: 0, completed: 0 };
      dateMap[t.date].total += 1;
      if (t.completed) dateMap[t.date].completed += 1;
    });

    let streak = 0;
    const dates = Object.keys(dateMap).sort().reverse();
    for (let d of dates) {
      const day = dateMap[d];
      if (day.total > 0 && day.completed / day.total >= 0.75) {
        streak += 1;
      } else {
        break;
      }
    }

    // Status tag
    let statusLabel = 'Getting Started';
    let statusClass = 'bg-[#F7F8F2] text-[#6E8581] border-[#A8DDD5]/60';
    if (rate === 100 && total > 0) {
      statusLabel = '⭐ Top Performer';
      statusClass = 'bg-[#E8F4F0] text-[#073F40] border-[#159A92]/40 font-bold';
    } else if (rate >= 75) {
      statusLabel = '🔥 High Output';
      statusClass = 'bg-[#E8F4F0] text-[#0B5553] border-[#A8DDD5]/60';
    } else if (rate >= 50) {
      statusLabel = '📈 On Track';
      statusClass = 'bg-[#E8F4F0] text-[#159A92] border-[#A8DDD5]/60';
    }

    return {
      member,
      total,
      completed,
      pending: total - completed,
      rate,
      streak,
      categoriesMap,
      statusLabel,
      statusClass
    };
  });

  // Team summary statistics
  const totalTeamTasks = memberGrowthData.reduce((acc, m) => acc + m.total, 0);
  const totalTeamCompleted = memberGrowthData.reduce((acc, m) => acc + m.completed, 0);
  const overallTeamRate = totalTeamTasks > 0 ? Math.round((totalTeamCompleted / totalTeamTasks) * 100) : 0;

  // Find top performer
  const sortedByRate = [...memberGrowthData].sort((a, b) => b.rate - a.rate || b.completed - a.completed);
  const topMember = sortedByRate.length > 0 && sortedByRate[0].total > 0 ? sortedByRate[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 mb-10">
      {/* Scope Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[#A8DDD5]/40 gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#073F40] tracking-tight flex items-center gap-2 m-0">
            <TrendingUp size={22} className="text-[#159A92]" />
            <span>Team Growth & Working Results</span>
          </h2>
          <p className="text-xs text-[#6E8581] m-0 mt-1">
            Track individual team member overall progress and performance analytics.
          </p>
        </div>

        {/* Filter scope toggle buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#A8DDD5]/60 rounded-xl shadow-xs">
          <button
            onClick={() => setScope('selectedDate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              scope === 'selectedDate'
                ? 'bg-[#073F40] text-white shadow-xs'
                : 'text-[#6E8581] hover:text-[#073F40] bg-transparent'
            }`}
          >
            Date ({relativeDateTitle})
          </button>
          <button
            onClick={() => setScope('allTime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              scope === 'allTime'
                ? 'bg-[#073F40] text-white shadow-xs'
                : 'text-[#6E8581] hover:text-[#073F40] bg-transparent'
            }`}
          >
            All-Time Growth
          </button>
        </div>
      </div>

      {/* Team Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Team Completion Rate */}
        <div className="bg-white border border-[#A8DDD5]/50 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F4F0] text-[#073F40] flex items-center justify-center shrink-0">
            <BarChart3 size={22} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-[#6E8581] block">
              Team Completion
            </span>
            <span className="text-2xl font-black text-[#073F40] block">
              {overallTeamRate}%
            </span>
          </div>
        </div>

        {/* Card 2: Total Completed Tasks */}
        <div className="bg-white border border-[#A8DDD5]/50 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F4F0] text-[#159A92] flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-[#6E8581] block">
              Tasks Completed
            </span>
            <span className="text-2xl font-black text-[#073F40] block">
              {totalTeamCompleted} <span className="text-xs font-normal text-[#6E8581]">/ {totalTeamTasks} total</span>
            </span>
          </div>
        </div>

        {/* Card 3: Top Performer */}
        <div className="bg-white border border-[#A8DDD5]/50 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F4F0] text-[#0B5553] flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-[#6E8581] block">
              Top Performer
            </span>
            <span className="text-base font-bold text-[#073F40] block truncate">
              {topMember ? topMember.member.name : 'N/A'}
            </span>
          </div>
        </div>

        {/* Card 4: Active Team Members */}
        <div className="bg-white border border-[#A8DDD5]/50 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F4F0] text-[#073F40] flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-[#6E8581] block">
              Active Team
            </span>
            <span className="text-2xl font-black text-[#073F40] block">
              {members.length} Members
            </span>
          </div>
        </div>
      </div>

      {/* Individual Team Member Performance Grid */}
      <h3 className="text-base font-bold text-[#073F40] mb-4 flex items-center gap-2">
        <span>Individual Member Performance</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {memberGrowthData.map(({ member, total, completed, pending, rate, streak, categoriesMap, statusLabel, statusClass }) => (
          <div 
            key={member.id} 
            className="bg-white border border-[#A8DDD5]/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#159A92]/50 transition-all"
          >
            <div>
              {/* Member Header */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#073F40] text-[#A8DDD5] font-black text-base flex items-center justify-center shadow-xs">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#073F40] leading-tight m-0">
                      {member.name}
                    </h4>
                    <span className="text-xs text-[#6E8581] font-medium block">
                      {completed} of {total} tasks completed
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusClass}`}>
                  {statusLabel}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#073F40]">Completion Rate</span>
                  <span className="text-[#159A92] font-extrabold">{rate}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#E8F4F0] rounded-full overflow-hidden border border-[#A8DDD5]/40">
                  <div 
                    className="h-full bg-gradient-to-r from-[#159A92] to-[#073F40] rounded-full transition-all duration-500"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#F7F8F2] border border-[#A8DDD5]/40 rounded-xl mb-4 text-center">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#6E8581] block">Done</span>
                  <span className="text-sm font-bold text-[#073F40]">{completed}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#6E8581] block">Pending</span>
                  <span className="text-sm font-bold text-[#0B5553]">{pending}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#6E8581] block">Streak</span>
                  <span className="text-sm font-bold text-[#159A92] flex items-center justify-center gap-0.5">
                    <Flame size={12} className="fill-[#159A92]" />
                    {streak}d
                  </span>
                </div>
              </div>

              {/* Categories Breakdown */}
              <div>
                <span className="block text-[11px] font-bold uppercase text-[#6E8581] mb-2">
                  Category Progress
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(categoriesMap).length === 0 ? (
                    <span className="text-xs text-[#6E8581] italic">No activity recorded</span>
                  ) : (
                    Object.entries(categoriesMap).map(([cat, data]) => (
                      <span 
                        key={cat}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-[#E8F4F0] text-[#073F40] rounded-md border border-[#A8DDD5]/50"
                      >
                        <span>{cat}:</span>
                        <span className="font-bold text-[#159A92]">{data.completed}/{data.total}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Comparison Chart */}
      <div className="bg-white border border-[#A8DDD5]/60 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-[#073F40] mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-[#159A92]" />
          <span>Team Member Completion Comparison</span>
        </h3>

        <div className="space-y-3">
          {memberGrowthData.map(({ member, rate, completed, total }) => (
            <div key={member.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#073F40]">
                <span>{member.name}</span>
                <span>{rate}% ({completed}/{total} tasks)</span>
              </div>
              <div className="w-full h-3 bg-[#E8F4F0] rounded-full overflow-hidden border border-[#A8DDD5]/40">
                <div 
                  className="h-full bg-[#073F40] rounded-full transition-all duration-500"
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
