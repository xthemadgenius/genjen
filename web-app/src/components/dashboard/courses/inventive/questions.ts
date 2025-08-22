export interface Question {
  id: number;
  text: string;
  subtitle?: string;
  type: 'text' | 'textarea' | 'choice' | 'file' | 'contact';
  placeholder?: string;
  choices?: string[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

export const questions: Question[] = [
  {
    id: 1,
    text: "What inspires your most spontaneous creative moments?",
    subtitle: "Tell us about those magical moments when creativity just flows",
    type: "textarea",
    placeholder: "I feel most creative when...",
    validation: {
      required: true,
      minLength: 10,
      maxLength: 500
    }
  },
  {
    id: 2,
    text: "Which creative environment energizes you most?",
    subtitle: "Choose the space where your mind feels free to wander",
    type: "choice",
    choices: [
      "Quiet, organized workspace",
      "Bustling café or co-working space",
      "Nature and outdoor settings",
      "Cozy home corner with soft lighting"
    ],
    validation: {
      required: true
    }
  },
  {
    id: 3,
    text: "What's your creative superpower?",
    subtitle: "Everyone has a unique creative strength. What's yours?",
    type: "choice",
    choices: [
      "I see connections others miss",
      "I turn chaos into beautiful order",
      "I bring wild ideas to life",
      "I help others discover their creativity"
    ],
    validation: {
      required: true
    }
  },
  {
    id: 4,
    text: "Share a recent creative breakthrough or project",
    subtitle: "It could be big or small - we'd love to hear about it!",
    type: "textarea",
    placeholder: "Recently, I created/discovered/realized...",
    validation: {
      required: true,
      minLength: 20,
      maxLength: 600
    }
  },
  {
    id: 5,
    text: "What creative tools make you feel most alive?",
    subtitle: "Select all that spark joy in your creative process",
    type: "choice",
    choices: [
      "Digital design tools (Figma, Sketch, etc.)",
      "Traditional art supplies (pens, paints, paper)",
      "Writing and storytelling",
      "Music and sound creation",
      "Code and programming",
      "Photography and visual media"
    ],
    validation: {
      required: true
    }
  },
  {
    id: 6,
    text: "Upload something that represents your creative spirit",
    subtitle: "A photo, sketch, design, or anything that shows your creative side",
    type: "file",
    validation: {
      required: false
    }
  },
  {
    id: 7,
    text: "When do you feel most creatively blocked?",
    subtitle: "Understanding barriers helps us design better solutions",
    type: "choice",
    choices: [
      "When I have too many ideas at once",
      "When perfectionism takes over",
      "When I feel rushed or pressured",
      "When I'm in the wrong environment",
      "When I doubt my abilities"
    ],
    validation: {
      required: true
    }
  },
  {
    id: 8,
    text: "What would spontaneous freedom in creativity look like for you?",
    subtitle: "Dream big - what would unlock your full creative potential?",
    type: "textarea",
    placeholder: "My ideal creative freedom would be...",
    validation: {
      required: true,
      minLength: 15,
      maxLength: 400
    }
  },
  {
    id: 9,
    text: "How do you prefer to learn new creative skills?",
    subtitle: "Help us tailor the experience to your learning style",
    type: "choice",
    choices: [
      "Visual tutorials and step-by-step guides",
      "Hands-on experimentation and play",
      "Community discussions and peer learning",
      "Quick tips and bite-sized lessons",
      "Deep dives and comprehensive courses"
    ],
    validation: {
      required: true
    }
  },
  {
    id: 10,
    text: "Let's stay connected on your creative journey!",
    subtitle: "We'd love to send you personalized creative resources and updates",
    type: "contact",
    validation: {
      required: true
    }
  }
];

export const getQuestionById = (id: number): Question | undefined => {
  return questions.find(q => q.id === id);
};

export const getTotalQuestions = (): number => {
  return questions.length;
};