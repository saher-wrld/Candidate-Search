import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import type {Candidate} from '../interfaces/Candidate.interface';
import CandidateCard from '../components/CandidateCard';

const CandidateSearch = () => {
const [results, setResults] = useState<Candidate[]>([]);
const [currentUser, setCurrentUser] = useState<Candidate>({
  id: null,
    login: null,
    email: null,
    html_url: null,
    name: null,
    bio: null,
    company: null,
    location: null,
    avatar_url: null,
});
const [currentIndex, setCurrentIndex] = useState<number>(0);

useEffect(() => {
  searchForUsers();
}, []);

const searchForSpecUser = async (user: string) => {
  const data: Candidate = await searchGithubUser(user);
  setCurrentUser(data);
}

const searchForUsers = async () => {
  const data: Candidate[] = await searchGithub();
  setResults(data);

  await searchForSpecUser(data[currentIndex].login || '');
};

const userChoice = async (isSelected: boolean) => {
  if (isSelected) {
    let parsedCandidates: Candidate[] = [];
    const savedCandidates = localStorage.getItem('savedCandidates');
    if (typeof savedCandidates === 'string') {
      parsedCandidates = JSON.parse(savedCandidates);
    }
    parsedCandidates.push(currentUser);
    localStorage.setItem('savedCandidates', JSON.stringify(parsedCandidates));
  }
  if (currentIndex + 1 < results.length) {
    setCurrentIndex(currentIndex + 1);
    await searchForSpecUser(results[currentIndex + 1].login || '');
  } else {
    setCurrentIndex(0);
    await searchForUsers();
  }
}
  return (
  <>
  <h1>Candidate Search</h1>
  <CandidateCard currentUser={currentUser} userChoice={userChoice} />
  </>
  );
};

export default CandidateSearch;