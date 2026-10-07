import React, { useState } from 'react';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
import DailyProgress from './components/DailyProgress';
import TaskList from './components/TaskList';
import GrowthDashboard from './components/GrowthDashboard';
import AddTaskModal from './components/AddTaskModal';
import BatchPlannerModal from './components/BatchPlannerModal';
import { LayoutGrid, TrendingUp } from 'lucide-react';

import { useTasks } from './hooks/useTasks';

export default function App() {
  const {
    members,
    selectedDateKey,
    selectedDateTasks,
    allTasks,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    selectDate,
    toggleTaskCompletion,
    addTasks,
    addBatchPlanningTasks,
    editTask,
    moveTaskToDate,
    duplicateTask,
    deleteTask,
    completedCount,
    totalCount,
    progressPercentage,
    streakDays
  } = useTasks();

  const [activeTab, setActiveTab] = useState('board'); // 'board' | 'growth'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedMemberForAdd, setSelectedMemberForAdd] = useState('member-1');

  const handleOpenAddTask = (memberId = 'member-1') => {
    setTaskToEdit(null);
    setSelectedMemberForAdd(typeof memberId === 'string' ? memberId : 'member-1');
    setIsAddModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    if (task && task.memberId) {
      setSelectedMemberForAdd(task.memberId);
    }
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#123536] font-sans antialiased selection:bg-[#A8DDD5] selection:text-[#073F40]">
      {/* Header with Streak & Actions */}
      <Header
        streakDays={streakDays}
        onOpenAddTask={() => handleOpenAddTask('member-1')}
        onOpenBatchPlanner={() => setIsBatchModalOpen(true)}
      />

      {/* Main View Navigation Tabs (Team Board vs Growth Dashboard) */}
      <div className="max-w-7xl mx-auto px-4 mb-4 flex justify-center">
        <div className="inline-flex p-1 bg-white border border-[#A8DDD5]/60 rounded-xl shadow-xs gap-1">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'board'
                ? 'bg-[#073F40] text-white shadow-xs'
                : 'text-[#6E8581] hover:text-[#073F40] hover:bg-[#E8F4F0]'
            }`}
          >
            <LayoutGrid size={15} />
            <span>Team Task Board (5 Members)</span>
          </button>

          <button
            onClick={() => setActiveTab('growth')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'growth'
                ? 'bg-[#073F40] text-white shadow-xs'
                : 'text-[#6E8581] hover:text-[#073F40] hover:bg-[#E8F4F0]'
            }`}
          >
            <TrendingUp size={15} />
            <span>Growth Dashboard</span>
          </button>
        </div>
      </div>

      {/* View 1: Team Task Board */}
      {activeTab === 'board' && (
        <>
          {/* Date Navigation & Calendar Picker */}
          <DateSelector
            selectedDateKey={selectedDateKey}
            onPrevDay={goToPreviousDay}
            onNextDay={goToNextDay}
            onSelectToday={goToToday}
            onSelectDate={selectDate}
          />

          {/* Minimal Progress Bar */}
          <DailyProgress
            completedCount={completedCount}
            totalCount={totalCount}
            percentage={progressPercentage}
          />

          {/* Main Team Task Columns (5 columns for 5 members) */}
          <TaskList
            members={members}
            tasks={selectedDateTasks}
            selectedDateKey={selectedDateKey}
            onToggleCompletion={toggleTaskCompletion}
            onEdit={handleOpenEditTask}
            onMoveTo={moveTaskToDate}
            onDuplicate={duplicateTask}
            onDelete={deleteTask}
            onOpenAddTask={handleOpenAddTask}
          />
        </>
      )}

      {/* View 2: Separate Growth Dashboard for Team Results */}
      {activeTab === 'growth' && (
        <GrowthDashboard
          members={members}
          allTasks={allTasks}
          selectedDateKey={selectedDateKey}
          selectedDateTasks={selectedDateTasks}
        />
      )}

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedDateKey={selectedDateKey}
        onSaveTasks={addTasks}
        taskToEdit={taskToEdit}
        onEditSave={editTask}
        members={members}
        defaultMemberId={selectedMemberForAdd}
      />

      {/* Multi-day Batch Planner Modal */}
      <BatchPlannerModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSaveBatchPlans={addBatchPlanningTasks}
        selectedDateKey={selectedDateKey}
        members={members}
      />
    </div>
  );
}
