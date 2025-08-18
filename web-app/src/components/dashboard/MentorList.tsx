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
    name: 'Prashant Kumar Singh',
    role: 'Senior Software Engineer',
    specialization: 'Frontend Development',
    isFollowing: false,
    followers: 1247,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'UX Design Lead',
    specialization: 'User Experience',
    isFollowing: true,
    followers: 892,
    rating: 4.8
  },
  {
    id: '3',
    name: 'David Chen',
    role: 'Full Stack Developer',
    specialization: 'Backend Architecture',
    isFollowing: false,
    followers: 1534,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    role: 'Data Scientist',
    specialization: 'Machine Learning',
    isFollowing: true,
    followers: 967,
    rating: 4.7
  }
];

const MentorList: React.FC<MentorListProps> = ({ mentors = defaultMentors }) => {
  const [mentorStates, setMentorStates] = useState(mentors);

  const handleFollowToggle = (mentorId: string) => {
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

  const formatFollowers = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <section className={styles.mentorList}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Top Mentors</h2>
        <button className={styles.viewAllBtn}>
          View All
        </button>
      </div>

      <div className={styles.mentorsGrid}>
        {mentorStates.map((mentor) => (
          <div key={mentor.id} className={styles.mentorCard}>
            {/* Mentor Avatar */}
            <div className={styles.mentorAvatar}>
              {mentor.avatar ? (
                <img src={mentor.avatar} alt={mentor.name} />
              ) : (
                <span>{mentor.name.charAt(0)}</span>
              )}
              
              {/* Rating Badge */}
              <div className={styles.ratingBadge}>
                <svg viewBox="0 0 24 24" width="12" height="12">
                  <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span>{mentor.rating}</span>
              </div>
            </div>

            {/* Mentor Info */}
            <div className={styles.mentorInfo}>
              <h3 className={styles.mentorName}>{mentor.name}</h3>
              <p className={styles.mentorRole}>{mentor.role}</p>
              <p className={styles.mentorSpecialization}>{mentor.specialization}</p>
              
              {/* Followers Count */}
              <div className={styles.followersInfo}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1H4zm0-9.5C4 7.12 5.12 6 6.5 6S9 7.12 9 8.5 7.88 11 6.5 11 4 9.88 4 8.5zm11 4.5c1.33 0 4 .67 4 2v1h-4v-1c0-.82-.84-1.55-2-1.82.74-.5 1.42-1.07 2-1.18z"/>
                </svg>
                <span>{formatFollowers(mentor.followers)} followers</span>
              </div>
            </div>

            {/* Follow Button */}
            <button 
              className={`${styles.followBtn} ${mentor.isFollowing ? styles.following : ''}`}
              onClick={() => handleFollowToggle(mentor.id)}
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default MentorList;