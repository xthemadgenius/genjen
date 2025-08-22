'use client';

import React, { useState } from 'react';
import styles from './css/MentorList.module.css';

interface Mentor {
  id: string;
  name: string;
  role: string;
  specialization: string;
  avatar?: string;
  isFollowing: boolean;
  followers: number;
  rating: number;
}

interface MentorListProps {
  mentors?: Mentor[];
}

const defaultMentors: Mentor[] = [
  {
    id: '1',
    name: 'Lee Richter',
    role: 'Global Leader',
    specialization: 'Frontend Development',
    isFollowing: true,
    followers: 1247,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Tony Robbins',
    role: 'Mind Coach',
    specialization: 'Frontend Development',
    isFollowing: true,
    followers: 892,
    rating: 4.8
  },
  {
    id: '3',
    name: 'Peter Cobabe',
    role: 'AI Expert',
    specialization: 'Frontend Development',
    isFollowing: false,
    followers: 1534,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Gary Vee',
    role: 'Marketing Mentor',
    specialization: 'Frontend Development',
    isFollowing: false,
    followers: 967,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Alex Hermozi',
    role: 'Marketing Genius',
    specialization: 'Frontend Development',
    isFollowing: true,
    followers: 823,
    rating: 4.6
  }
];

const MentorList: React.FC<MentorListProps> = ({ mentors = defaultMentors }) => {
  const [mentorStates, setMentorStates] = useState(mentors);
  const [hoveredMentor, setHoveredMentor] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleFollowToggle = (mentorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setMentorStates(prevMentors =>
      prevMentors.map(mentor => {
        if (mentor.id === mentorId) {
          return {
            ...mentor,
            isFollowing: !mentor.isFollowing,
            followers: mentor.isFollowing 
              ? mentor.followers - 1 
              : mentor.followers + 1
          };
        }
        return mentor;
      })
    );
  };

  const handleMentorClick = (mentorId: string) => {
    setSelectedMentor(selectedMentor === mentorId ? null : mentorId);
  };

  const displayedMentors = showAll ? mentorStates : mentorStates.slice(0, 3);


  return (
    <section className={styles.mentorList}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Your Mentor</h2>
        <button 
          className={styles.viewAllBtn}
          onClick={() => setShowAll(!showAll)}
          aria-label={showAll ? 'Collapse mentor list' : 'Expand mentor list'}
          title={showAll ? 'Show Less' : 'Show More'}
        >
          {showAll ? (
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          )}
        </button>
      </div>

      <div className={styles.mentorsList}>
        {displayedMentors.map((mentor) => (
          <div 
            key={mentor.id} 
            className={`${styles.mentorItem} ${hoveredMentor === mentor.id ? styles.hovered : ''} ${selectedMentor === mentor.id ? styles.selected : ''}`}
            onMouseEnter={() => setHoveredMentor(mentor.id)}
            onMouseLeave={() => setHoveredMentor(null)}
            onClick={() => handleMentorClick(mentor.id)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${mentor.name}, ${mentor.role}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMentorClick(mentor.id);
              }
            }}
          >
            <div className={styles.mentorAvatar}>
              {mentor.avatar ? (
                <img src={mentor.avatar} alt={mentor.name} />
              ) : (
                <span>{mentor.name.charAt(0)}</span>
              )}
              <div className={styles.ratingBadge}>
                <svg viewBox="0 0 24 24" width="7.2" height="7.2">
                  <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {mentor.rating}
              </div>
            </div>

            <div className={styles.mentorInfo}>
              <div className={styles.mentorName}>{mentor.name}</div>
              <div className={styles.mentorRole}>{mentor.role}</div>
              {selectedMentor === mentor.id && (
                <div className={styles.mentorSpecialization}>
                  {mentor.specialization}
                </div>
              )}
            </div>

            {selectedMentor === mentor.id && (
              <div className={styles.followersInfo}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.83 0-1.54.5-1.85 1.22l-1.92 5.78H9.5L8 12.5 7 14l2 1.5v4.5h2v-6l1.5-1.13L13.5 18H20z"/>
                </svg>
                {mentor.followers.toLocaleString()}
              </div>
            )}

            <button 
              className={`${styles.followBtn} ${mentor.isFollowing ? styles.following : ''}`}
              onClick={(e) => handleFollowToggle(mentor.id, e)}
              aria-label={`${mentor.isFollowing ? 'Unfollow' : 'Follow'} ${mentor.name}`}
            >
              {mentor.isFollowing ? (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Following
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Follow
                </>
              )}
            </button>
            
            {/* Hover Tooltip */}
            {hoveredMentor === mentor.id && selectedMentor !== mentor.id && (
              <div className={styles.mentorTooltip}>
                <div className={styles.tooltipContent}>
                  <div className={styles.tooltipTitle}>{mentor.name}</div>
                  <div className={styles.tooltipSubtitle}>{mentor.role}</div>
                  <div className={styles.tooltipStats}>
                    <span>⭐ {mentor.rating} rating</span>
                    <span>👥 {mentor.followers.toLocaleString()} followers</span>
                  </div>
                  <div className={styles.tooltipSpecialization}>{mentor.specialization}</div>
                </div>
                <div className={styles.tooltipArrow}></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Show More/Less Button */}
      {mentorStates.length > 3 && (
        <div className={styles.seeAllContainer}>
          <button 
            className={styles.seeAllButton}
            onClick={() => setShowAll(!showAll)}
            aria-label={showAll ? 'Show fewer mentors' : 'Show all mentors'}
          >
            {showAll ? (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="m7 14 5-5 5 5z"/>
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="m7 10 5 5 5-5z"/>
                </svg>
                View All ({mentorStates.length})
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default MentorList;