// Quest Data Structure
const QUEST_TYPES = {
    ACADEMIC: 'academic',
    ADVENTURE: 'adventure',
    CODING: 'coding',
    PERSONAL: 'personal'
};

const QUEST_STATUS = {
    LOCKED: 'locked',
    AVAILABLE: 'available',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed'
};

const DIFFICULTY = {
    EASY: { stars: 1, xp: 50 },
    MEDIUM: { stars: 2, xp: 100 },
    HARD: { stars: 3, xp: 200 },
    EXPERT: { stars: 4, xp: 350 },
    LEGENDARY: { stars: 5, xp: 500 }
};

// Quest data
const quests = [
    {
        id: 'q1',
        title: 'First Steps in Programming',
        type: QUEST_TYPES.CODING,
        description: 'Master the basics of C programming by creating your first functional program.',
        difficulty: DIFFICULTY.EASY,
        rewards: ['Programming Basics Badge', '+50 XP', 'C Skill +1'],
        requirements: [],
        status: QUEST_STATUS.AVAILABLE,
        icon: 'c.png',
        relatedSkill: 'C',
        steps: [
            { id: 'q1-s1', description: 'Write a "Hello World" program', completed: false },
            { id: 'q1-s2', description: 'Create a program that calculates factorial', completed: false },
            { id: 'q1-s3', description: 'Implement a simple calculator', completed: false }
        ]
    },
    {
        id: 'q2',
        title: 'Mountain Explorer',
        type: QUEST_TYPES.ADVENTURE,
        description: 'Embark on a hiking adventure and document your journey to the summit.',
        difficulty: DIFFICULTY.MEDIUM,
        rewards: ['Explorer Badge', '+100 XP', 'Stamina +2'],
        requirements: [],
        status: QUEST_STATUS.AVAILABLE,
        icon: 'adventure.jpg',
        relatedSkill: 'Outdoor',
        steps: [
            { id: 'q2-s1', description: 'Plan your hiking route', completed: false },
            { id: 'q2-s2', description: 'Reach the mountain summit', completed: false },
            { id: 'q2-s3', description: 'Document the view with photos', completed: false },
            { id: 'q2-s4', description: 'Safely return from your adventure', completed: false }
        ]
    },
    {
        id: 'q3',
        title: 'Web Development Initiate',
        type: QUEST_TYPES.CODING,
        description: 'Create your first interactive webpage using HTML, CSS, and JavaScript.',
        difficulty: DIFFICULTY.MEDIUM,
        rewards: ['Web Developer Badge', '+100 XP', 'HTML Skill +1', 'CSS Skill +1', 'JavaScript Skill +1'],
        requirements: ['q1'],
        status: QUEST_STATUS.LOCKED,
        icon: 'java.png',
        relatedSkill: 'JAVASCRIPT',
        steps: [
            { id: 'q3-s1', description: 'Design the webpage structure with HTML', completed: false },
            { id: 'q3-s2', description: 'Style the page with CSS', completed: false },
            { id: 'q3-s3', description: 'Add interactivity with JavaScript', completed: false },
            { id: 'q3-s4', description: 'Make the design responsive', completed: false }
        ]
    }
];

// Player data
const playerData = {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    completedQuests: [],
    activeQuests: [],
    inventory: [],
    achievements: []
};

// Export data
export { QUEST_TYPES, QUEST_STATUS, DIFFICULTY, quests, playerData };