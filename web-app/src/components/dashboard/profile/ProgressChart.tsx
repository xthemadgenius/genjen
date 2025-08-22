'use client';

import React, { useState } from 'react';
import styles from './css/ProgressChart.module.css';

interface ActivityData {
  day: string;
  date: string;
  completed: number;
  total: number;
  percentage: number;
}

interface ProgressChartProps {
  weeklyData?: ActivityData[];
  currentStreak?: number;
  totalCompleted?: number;
  monthlyGoal?: number;
}

const defaultWeeklyData: ActivityData[] = [
  { day: 'Mon', date: '12', completed: 3, total: 4, percentage: 75 },
  { day: 'Tue', date: '13', completed: 2, total: 3, percentage: 67 },
  { day: 'Wed', date: '14', completed: 4, total: 4, percentage: 100 },
  { day: 'Thu', date: '15', completed: 1, total: 3, percentage: 33 },
  { day: 'Fri', date: '16', completed: 3, total: 3, percentage: 100 },
  { day: 'Sat', date: '17', completed: 2, total: 2, percentage: 100 },
  { day: 'Sun', date: '18', completed: 0, total: 2, percentage: 0 }
];

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  weeklyData = defaultWeeklyData,
  currentStreak = 5,
  totalCompleted = 15,
  monthlyGoal = 20
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  const monthlyProgress = Math.min((totalCompleted / monthlyGoal) * 100, 100);
  const today = new Date().getDay() || 7; // Convert Sunday (0) to 7
  const todayIndex = today - 1; // Convert to 0-based index

  return (
    <section className={styles.progressChart}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Weekly Activity</h2>
        <div className={styles.streak}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
          </svg>
          <span>{currentStreak} day streak</span>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className={styles.chartContainer}>
        <div className={styles.weeklyChart}>
          {weeklyData.map((day, index) => (
            <div 
              key={day.day} 
              className={`${styles.dayColumn} ${hoveredDay === index ? styles.hovered : ''} ${selectedDay === index ? styles.selected : ''}`}
              onMouseEnter={() => setHoveredDay(index)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => setSelectedDay(selectedDay === index ? null : index)}
              role="button"
              tabIndex={0}
              aria-label={`${day.day} ${day.date}: ${day.completed} of ${day.total} tasks completed (${day.percentage}%)`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedDay(selectedDay === index ? null : index);
                }
              }}
            >
              <div className={styles.dayLabel}>{day.day}</div>
              <div className={styles.dateLabel}>{day.date}</div>
              
              <div className={styles.progressBar}>
                <div className={styles.progressTrack}>
                  <div 
                    className={`${styles.progressFill} ${index === todayIndex ? styles.today : ''} ${hoveredDay === index ? styles.fillHover : ''}`}
                    style={{ height: `${day.percentage}%` }}
                  />
                </div>
                
                {/* Progress Indicator */}
                <div className={`${styles.progressIndicator} ${hoveredDay === index ? styles.indicatorHover : ''}`}>
                  {day.completed > 0 ? (
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  ) : (
                    <div className={styles.emptyIndicator} />
                  )}
                </div>
              </div>
              
              <div className={styles.dayStats}>
                <span className={styles.completed}>{day.completed}</span>
                <span className={styles.separator}>/</span>
                <span className={styles.total}>{day.total}</span>
              </div>
              
              {/* Tooltip */}
              {hoveredDay === index && (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipContent}>
                    <div className={styles.tooltipTitle}>{day.day}, {day.date}</div>
                    <div className={styles.tooltipStats}>
                      <span>{day.completed} of {day.total} tasks completed</span>
                      <span className={styles.tooltipPercentage}>{day.percentage}%</span>
                    </div>
                  </div>
                  <div className={styles.tooltipArrow}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Progress */}
      <div 
        className={styles.monthlyProgress}
        onMouseEnter={() => setHoveredDay(-1)}
        onMouseLeave={() => setHoveredDay(null)}
      >
        <div className={styles.monthlyHeader}>
          <h3 className={styles.monthlyTitle}>Monthly Goal</h3>
          <span className={styles.monthlyStats}>
            {totalCompleted}/{monthlyGoal} lessons
          </span>
        </div>
        
        <div className={styles.monthlyProgressBar}>
          <div 
            className={`${styles.monthlyProgressFill} ${hoveredDay === -1 ? styles.monthlyFillHover : ''}`}
            style={{ width: `${monthlyProgress}%` }}
          />
        </div>
        
        <div className={styles.monthlyMeta}>
          <span className={styles.monthlyPercentage}>
            {Math.round(monthlyProgress)}% complete
          </span>
          <span className={styles.monthlyRemaining}>
            {monthlyGoal - totalCompleted} lessons to go
          </span>
        </div>
        
        {hoveredDay === -1 && (
          <div className={styles.monthlyTooltip}>
            <div className={styles.tooltipContent}>
              <div className={styles.tooltipTitle}>Monthly Progress</div>
              <div className={styles.tooltipStats}>
                <span>Completed: {totalCompleted} lessons</span>
                <span>Remaining: {monthlyGoal - totalCompleted} lessons</span>
                <span className={styles.tooltipPercentage}>{Math.round(monthlyProgress)}% of goal</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      <div className={styles.achievements}>
        <div className={styles.achievementBadge}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>Fast Learner</span>
        </div>
        
        <div className={styles.achievementBadge}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
          </svg>
          <span>On Fire</span>
        </div>
      </div>
    </section>
  );
};

export default ProgressChart;