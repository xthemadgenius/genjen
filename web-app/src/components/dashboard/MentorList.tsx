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
    role: 'Software Developer',
    specialization: 'Frontend Development',
    isFollowing: true,
    followers: 1247,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Prashant Kumar Singh',
    role: 'Software Developer',
    specialization: 'Frontend Development',
    isFollowing: true,
    followers: 892,
    rating: 4.8
  },
  {
    id: '3',
    name: 'Prashant Kumar Singh',
    role: 'Software Developer',
    specialization: 'Frontend Development',
    isFollowing: false,
    followers: 1534,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Prashant Kumar Singh',
    role: 'Software Developer',
    specialization: 'Frontend Development',
    isFollowing: false,
    followers: 967,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Prashant Kumar Singh',
    role: 'Software Developer',
    specialization: 'Frontend Development',
    isFollowing: true,
    followers: 823,
    rating: 4.6
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


  return (
    <section className={styles.mentorList}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Your Mentor</h2>
        <button className={styles.viewAllBtn}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>

      <div className={styles.mentorsList}>
        {mentorStates.map((mentor) => (
          <div key={mentor.id} className={styles.mentorItem}>
            <div className={styles.mentorAvatar}>
              {mentor.avatar ? (
                <img src={mentor.avatar} alt={mentor.name} />
              ) : (
                <span>{mentor.name.charAt(0)}</span>
              )}
            </div>

            <div className={styles.mentorInfo}>
              <div className={styles.mentorName}>{mentor.name}</div>
              <div className={styles.mentorRole}>{mentor.role}</div>
            </div>

            <button 
              className={`${styles.followBtn} ${mentor.isFollowing ? styles.following : ''}`}
              onClick={() => handleFollowToggle(mentor.id)}
              aria-label={`${mentor.isFollowing ? 'Unfollow' : 'Follow'} ${mentor.name}`}
            >
              {mentor.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MentorList;