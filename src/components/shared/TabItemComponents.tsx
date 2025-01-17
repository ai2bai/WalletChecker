import { lazy } from 'react';
import { TabComponent } from '@/types';

const GithubChecker = lazy(() => import('../tabs/research/GithubChecker'));
const WalletChecker = lazy(() => import('../tabs/research/WalletChecker'));
const VISION = lazy(() => import('../tabs/research/vision'));
const FORGE = lazy(() => import('../tabs/research/AgentDeployment'));

const TransactionTranslator = lazy(() => import('../tabs/degens/TransactionTranslator'));
const TrenchRadar = lazy(() => import('../tabs/degens/TrenchRadar'));
const WalletTracker = lazy(() => import('../tabs/degens/WalletTracker'));

const AIChatbox = lazy(() => import('../tabs/finance/AIChatbox'));
const MarketsentimentIndex = lazy(() => import('../tabs/finance/MarketsentimentIndex'));
const SocialSentimentAnalysis = lazy(() => import('../tabs/finance/SocialSentimentAnalysis'));
const YieldOptimizer = lazy(() => import('../tabs/finance/YieldOptimizer'));
const Bridge = lazy(() => import('../tabs/finance/Bridge'));
const AirdropTracker = lazy(() => import('../tabs/finance/AirdropTracker'));

const UserProfiles = lazy(() => import('../tabs/education/UserProfiles'));
const Leaderboards = lazy(() => import('../tabs/education/Leaderboards'));

export const TabItemComponents: Record<string, TabComponent> = {
  'Github checker': GithubChecker,
  'Wallet  Checker': WalletChecker,
  'Image Checker': VISION,
  'AgentDeployment(Soon)': FORGE,
  'Transaction translator': TransactionTranslator,
  'Trench radar': TrenchRadar,
  'KOLS Wallet tracker': WalletTracker,
  'AI Chatbox': AIChatbox,
  'Market sentiment Index': MarketsentimentIndex,
  'Social Sentiment Analysis': SocialSentimentAnalysis,
  'Yield Optimizer': YieldOptimizer,
  'Bridge': Bridge,
  'Airdrop Tracker': AirdropTracker,
  'User Profiles': UserProfiles,
  'Leaderboards': Leaderboards
};