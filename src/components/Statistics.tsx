import React from 'react';
import type { Statistics as StatisticsType } from '../types';

interface StatisticsProps {
  stats: StatisticsType;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="statistics">
      <div className="stat-item">
        <span className="stat-label">전체</span>
        <span className="stat-value">{stats.total}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">완료</span>
        <span className="stat-value">{stats.completed}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">진행중</span>
        <span className="stat-value">{stats.active}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">우선순위</span>
        <div className="priority-stats">
          <span className="high">높음: {stats.priorityCounts.high}</span>
          <span className="medium">중간: {stats.priorityCounts.medium}</span>
          <span className="low">낮음: {stats.priorityCounts.low}</span>
        </div>
      </div>
      <div className="stat-item">
        <span className="stat-label">지연</span>
        <span className="stat-value overdue">{stats.overdue}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">완료율</span>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${stats.completionRate}%` }}
          />
          <span className="progress-text">{stats.completionRate}%</span>
        </div>
      </div>
    </div>
  );
}; 