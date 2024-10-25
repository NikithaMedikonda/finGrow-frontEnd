import type {Config} from 'jest';

const config: Config = {
  collectCoverage: true, 
  collectCoverageFrom: [   
    "src/components/*.tsx", 
    "src/context/context.tsx" , 
    "src/forms/*.tsx" , 
    "src/pages/*.tsx", 
    "!<rootDir>/src/index.tsx"
   ],
  coveragePathIgnorePatterns: ["<rootDir>/src/index.tsx"],
    testMatch: ["src/tests/*.test.tsx"],
};

export default config;