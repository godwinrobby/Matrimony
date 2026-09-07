export interface Profile {
  id: string;
  name: string;
  gender: 'Bride' | 'Groom';
  age: number;
  height: string;
  religion: string;
  caste: string;
  subCaste?: string;
  motherTongue: string;
  profession: string;
  education: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  salary: string;
  diet: 'Veg' | 'Non-Veg' | 'Eggetarian' | 'Vegan';
  manglik: 'Manglik' | 'Non-Manglik' | 'Anshik' | 'No';
  horoscopeNeeded: boolean;
  starSign?: string;
  familyValues: 'Traditional' | 'Moderate' | 'Liberal';
  lifestyle: 'Modern' | 'Traditional' | 'Balanced';
  bio: string;
  image: string;
  verified: boolean;
  contactNumber?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  rashi?: string;
  nakshatra?: string;
  gotra?: string;

  // New Comprehensive Fields
  basicInfo?: {
    profileCreatedBy?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    weight?: string;
    bodyType?: string;
    complexion?: string;
    bloodGroup?: string;
    maritalStatus?: string;
    children?: string;
    disabilityStatus?: string;
    languagesKnown?: string[];
    nationality?: string;
    citizenship?: string;
  };
  contactInfo?: {
    mobileNumber?: string;
    whatsAppNumber?: string;
    email?: string;
    district?: string;
    area?: string;
    pinCode?: string;
    currentAddress?: string;
    permanentAddress?: string;
  };
  photos?: {
    mainProfilePhoto?: string;
    coverPhoto?: string;
    fullLengthPhoto?: string;
    traditionalDressPhoto?: string;
    casualPhoto?: string;
    familyPhoto?: string;
    album?: string[];
    privateAlbum?: boolean;
    verificationSelfie?: string;
  };
  aboutMe?: {
    personality?: string[];
    interests?: string[];
    hobbies?: string[];
    lifeGoals?: string;
    expectations?: string;
  };
  religiousInfo?: {
    templeVisits?: string;
    spiritualBeliefs?: string;
    religiousPractices?: string;
  };
  educationDetails?: {
    highestQualification?: string;
    degree?: string;
    specialization?: string;
    college?: string;
    university?: string;
    graduationYear?: number;
    additionalQualifications?: string[];
    certifications?: string[];
    academicAchievements?: string[];
  };
  occupationDetails?: {
    employmentType?: string;
    occupation?: string;
    companyName?: string;
    designation?: string;
    industry?: string;
    experience?: string;
    annualIncome?: string;
    monthlyIncome?: string;
    officeLocation?: string;
    workingCountry?: string;
    workVisa?: string;
    businessDetails?: string;
  };
  familyDetails?: {
    father?: {
      name?: string;
      occupation?: string;
      education?: string;
      business?: string;
      annualIncome?: string;
      status?: 'Alive' | 'Late';
    };
    mother?: {
      name?: string;
      occupation?: string;
      education?: string;
      status?: 'Homemaker' | 'Working' | 'Late';
    };
    siblings?: {
      brothers?: number;
      marriedBrothers?: number;
      sisters?: number;
      marriedSisters?: number;
    };
    familyType?: string;
    familyStatus?: string;
    nativePlace?: string;
    familyWealth?: string;
    ownHouse?: boolean;
    familyBusiness?: string;
  };
  habits?: {
    smoking?: 'Yes' | 'No' | 'Occasionally';
    drinking?: 'Yes' | 'No' | 'Occasionally';
    fitness?: string[];
    gym?: boolean;
    yoga?: boolean;
    pets?: string;
    travel?: string;
    drivingLicense?: boolean;
  };
  physicalAppearance?: {
    skinTone?: string;
    hairColor?: string;
    eyeColor?: string;
    beard?: boolean;
    bodyType?: string;
  };
  assets?: {
    ownHouse?: boolean;
    apartment?: boolean;
    villa?: boolean;
    land?: boolean;
    farm?: boolean;
    commercialProperty?: boolean;
    car?: string;
    bike?: string;
    investments?: string;
    gold?: string;
    savings?: string;
  };
  partnerPreferences?: {
    ageRange?: string;
    height?: string;
    maritalStatus?: string;
    religion?: string;
    caste?: string;
    subCaste?: string;
    qualification?: string;
    degree?: string;
    occupation?: string;
    income?: string;
    diet?: string;
    smoking?: string;
    drinking?: string;
    country?: string;
    state?: string;
    city?: string;
    star?: string;
    rasi?: string;
    dosham?: string;
  };
  aiCompatibility?: {
    personalityScore?: number;
    lifestyleMatch?: number;
    familyValuesMatch?: number;
    educationMatch?: number;
    careerMatch?: number;
    horoscopeMatch?: number;
    overallMatch?: number;
  };
  verification?: {
    mobileVerified?: boolean;
    emailVerified?: boolean;
    aadhaarVerified?: boolean;
    panVerified?: boolean;
    passportVerified?: boolean;
    employmentVerified?: boolean;
    educationVerified?: boolean;
    photoVerified?: boolean;
  };
  privacySettings?: {
    hideMobile?: boolean;
    hideEmail?: boolean;
    hideIncome?: boolean;
    hidePhotos?: boolean;
    hideHoroscope?: boolean;
    hideFamilyDetails?: boolean;
    privateProfile?: boolean;
  };
  activity?: {
    lastLogin?: string;
    onlineStatus?: 'Online' | 'Offline' | 'Recent';
    profileCompletion?: number;
    profileViews?: number;
    interestsSent?: number;
    interestsReceived?: number;
    shortlistedBy?: number;
  };
  premiumFeatures?: {
    premiumMember?: boolean;
    profileBoost?: boolean;
    spotlightProfile?: boolean;
    readReceipts?: boolean;
    unlimitedChat?: boolean;
    unlimitedContactView?: boolean;
    videoCallEnabled?: boolean;
  };
  aiProfileInsights?: {
    profileStrength?: string;
    missingInformation?: string[];
    suggestedImprovements?: string[];
    recommendedPhotos?: string[];
    matchProbability?: string;
    compatibilityAnalysis?: string;
  };
  documents?: {
    aadhaarCard?: boolean;
    panCard?: boolean;
    passport?: boolean;
    degreeCertificate?: boolean;
    salarySlip?: boolean;
    horoscopePdf?: boolean;
  };
}

export interface SearchFilters {
  gender?: 'Bride' | 'Groom';
  ageMin?: number;
  ageMax?: number;
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  profession?: string;
  education?: string;
  city?: string;
  state?: string;
  diet?: 'Veg' | 'Non-Veg' | 'Eggetarian' | 'Vegan' | '';
  manglik?: 'Manglik' | 'Non-Manglik' | 'Anshik' | 'No' | '';
  familyValues?: 'Traditional' | 'Moderate' | 'Liberal' | '';
  lifestyle?: 'Modern' | 'Traditional' | 'Balanced' | '';
  searchQuery?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'user' or profileId or 'pundit-ai'
  receiverId: string;
  text: string;
  timestamp: string;
  isAi?: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface SuccessStory {
  id: string;
  coupleName: string;
  weddingDate: string;
  story: string;
  image: string;
  rating: number;
  location: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: 'Wedding Planning' | 'Relationship' | 'Horoscope' | 'Tradition';
  author: string;
  readTime: string;
  date: string;
  content: string;
  image: string;
}
