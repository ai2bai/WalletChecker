"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Wifi,
  Battery,
  Grid,
  Search,
  Chrome,
  File,
  Settings,
  Image,
  Mail,
  Calendar,
  Coffee,
  ArrowLeft,
  PlayCircle,
  PauseCircle,
  SkipBack,
  SkipForward,
  VolumeX,
  Volume1,
  Volume2,
  Wallet,
  Github,
  Radio,
  Target,
  BarChart3,
  Activity,
  Folder,
  Terminal,
} from "lucide-react";
import Modal from "../components/layout/Modal";
import { TabItemComponents } from "../components/shared/TabItemComponents";
import Loading from "../components/shared/Loading";
import { TabItemProps } from "@/types";
import FolderModal from "../components/FolderModal";
import LinuxTerminal from "../components/Terminal";
import WelcomeModal from "../components/welcome";

interface Icon {
  id: string;
  name: string;
  icon: string;
  type: "static" | "folder";
  url?: string;
}

interface Song {
  name: string;
  file: string;
  cover: string;
}

interface TabContent {
  id: number;
  title: string; 
  description: string; 
  items: {
    name: string;
    icon: React.ReactNode;
  }[]; 
}

interface Position {
  x: number;
  y: number;
}

const SpaceUbuntuDesktop = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    name: "1",
    cover: "/covers/1.jpg",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [songIndex, setSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [scale, setScale] = useState(1);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    const savedIcons = localStorage.getItem("icons");
    setIcons(
      savedIcons
        ? JSON.parse(savedIcons)
        : [
            {
              id: "1",
              name: "DOCS",
              icon: "/gitbook.png",
              type: "static",
              url: "https://docs.example.com",
            },
            {
              id: "2",
              name: "X",
              icon: "/x.png",
              type: "static",
              url: "https://twitter.com",
            },
            {
              id: "3",
              name: "DEXSCREENER",
              icon: "/DEXSCREENER.png",
              type: "static",
              url: "https://dexscreener.com",
            },
            {
              id: "4",
              name: "DEXTOOLS",
              icon: "/dextools.png",
              type: "static",
              url: "https://dextools.io",
            },
          ]
    );
  }, []);
  const tabs = [
    {
      id: "RESEARCHES",
      title: "RESEARCHES",
    },
    {
      id: "DEGENS",
      title: "DEGENS",
    },
    {
      id: "FINANCE",
      title: "FINANCE",
    },
    {
      id: "EDUCATION",
      title: "PROFILE",
    },
  ];

  const tabContents: Record<string, TabContent> = {
    RESEARCHES: {
      id: 1,
      title: "Research Hub",
      description: "Explore the latest research and analysis",
      items: [
        {
          name: "Github checker",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          ),
        },
        {
          name: "Wallet  Checker",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <path d="M18 14h-4" />
            </svg>
          ),
        },
        {
          name: "Image Checker",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <path d="M18 14h-4" />
            </svg>
          ),
        },
      ],
    },
    DEGENS: {
      id: 2,
      title: "Degen Zone",
      description: "High-risk, high-reward opportunities",
      items: [        
        {
          name: "Trench radar",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="2" y1="8" x2="22" y2="8" />

              <rect x="10" y="2" width="4" height="4" />

              <path d="M8 8 C 8 12, 12 16, 12 20" fill="none" />
              <path d="M16 8 C 16 12, 12 16, 12 20" fill="none" />

              <circle cx="12" cy="16" r="1" fill="currentColor" />

              <line x1="4" y1="12" x2="6" y2="12" />
              <line x1="4" y1="16" x2="6" y2="16" />
              <line x1="4" y1="20" x2="6" y2="20" />
            </svg>
          ),
        },
        {
          name: "KOLS Wallet tracker",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <path d="M12 8a4 4 0 0 1 0 8" />
              <path d="M12 5a7 7 0 0 1 0 14" opacity="0.5" />
              <path
                d="M17 6l-1.5-3-1.5 3-3 .5 2 2-.5 3 3-1.5 3 1.5-.5-3 2-2z"
                fill="currentColor"
              />
            </svg>
          ),
        },
        {
          name: "AgentDeployment(Soon)",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <path d="M18 14h-4" />
            </svg>
          ),
        },
      ],
    },
    FINANCE: {
      id: 3,
      title: "Financial Tools",
      description: "Financial planning and analysis tools",
      items: [
        {
          name: "AI Chatbox",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              x="0"
              y="0"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
            >
              <g>
                <path
                  d="M337.24 250.53h-73.25v-53.7c13.85-3.56 24.12-16.16 24.12-31.11 0-17.69-14.41-32.09-32.12-32.09-17.69 0-32.09 14.4-32.09 32.09 0 14.95 10.26 27.54 24.09 31.11v53.7h-73.25c-51.39 0-93.2 41.81-93.2 93.2v55.47c0 51.39 41.81 93.2 93.2 93.2h162.48c51.39 0 93.2-41.81 93.2-93.2v-55.47c.02-51.39-41.79-93.2-93.18-93.2zm-97.34-84.81c0-8.88 7.22-16.1 16.1-16.1 8.89 0 16.13 7.22 16.13 16.1 0 8.89-7.24 16.13-16.13 16.13-8.88 0-16.1-7.24-16.1-16.13zm174.56 233.49c0 42.58-34.64 77.22-77.22 77.22H174.76c-42.58 0-77.21-34.64-77.21-77.22v-55.47c0-42.58 34.64-77.22 77.21-77.22h162.48c42.58 0 77.22 34.64 77.22 77.22zm-84.84-90.23H182.38c-34.46 0-62.5 28.04-62.5 62.5s28.04 62.5 62.5 62.5h147.23c34.48 0 62.53-28.04 62.53-62.5s-28.04-62.5-62.52-62.5zm0 109.02H182.38c-25.65 0-46.52-20.87-46.52-46.52s20.87-46.52 46.52-46.52h147.23c25.67 0 46.54 20.87 46.54 46.52S355.28 418 329.62 418zm-129.09-80.28c-18.62 0-33.76 15.15-33.76 33.76 0 18.62 15.15 33.76 33.76 33.76 18.6 0 33.73-15.15 33.73-33.76s-15.13-33.76-33.73-33.76zm0 51.54c-9.8 0-17.77-7.97-17.77-17.77s7.97-17.77 17.77-17.77c9.79 0 17.75 7.97 17.75 17.77-.01 9.79-7.97 17.77-17.75 17.77zm110.94-51.54c-18.6 0-33.73 15.15-33.73 33.76 0 18.62 15.13 33.76 33.73 33.76 18.62 0 33.76-15.15 33.76-33.76s-15.14-33.76-33.76-33.76zm0 51.54c-9.78 0-17.74-7.97-17.74-17.77s7.96-17.77 17.74-17.77c9.8 0 17.77 7.97 17.77 17.77.01 9.79-7.97 17.77-17.77 17.77zM469.34 19.59H345.15c-23.51 0-42.63 19.13-42.63 42.63v63.55c0 23.52 19.13 42.66 42.63 42.66h5.73v24.29c0 5.47 3.08 10.32 8.07 12.68 1.94.91 3.99 1.35 6.01 1.35 3.2 0 6.34-1.11 8.89-3.26l42.2-35.06h53.3c23.52 0 42.66-19.14 42.66-42.66V62.22c-.01-23.5-19.15-42.63-42.67-42.63zm26.67 106.19c0 14.71-11.97 26.67-26.67 26.67h-54c-3.35 0-6.36 1.08-8.96 3.23l-39.51 32.83v-22.06c0-7.72-6.28-14-14-14h-7.71c-14.69 0-26.65-11.97-26.65-26.67V62.22c0-14.69 11.95-26.65 26.65-26.65h124.19c14.71 0 26.67 11.95 26.67 26.65v63.56zm-22.9-53.29c0 4.42-3.58 7.99-7.99 7.99H349.4c-4.42 0-7.99-3.58-7.99-7.99s3.58-7.99 7.99-7.99h115.71c4.42-.01 8 3.57 8 7.99zm-44.34 43.05c0 4.42-3.58 7.99-7.99 7.99H349.4c-4.42 0-7.99-3.58-7.99-7.99s3.58-7.99 7.99-7.99h71.38c4.41 0 7.99 3.58 7.99 7.99zm-290.66 87.92c2.58 2.17 5.73 3.3 8.94 3.3 2.03 0 4.08-.45 6.04-1.36 4.96-2.34 8.03-7.2 8.03-12.67v-24.29h5.73c23.51 0 42.63-19.14 42.63-42.66V62.22c0-23.51-19.13-42.63-42.63-42.63H42.66C19.14 19.59 0 38.72 0 62.22v63.55c0 23.52 19.14 42.66 42.66 42.66h53.3zM15.99 125.78V62.22c0-14.69 11.97-26.65 26.67-26.65h124.19c14.69 0 26.64 11.95 26.64 26.65v63.55c0 14.71-11.95 26.67-26.64 26.67h-7.71c-7.72 0-14 6.28-14 14v22.06l-39.53-32.85c-2.59-2.13-5.6-3.22-8.94-3.22h-54c-14.71.02-26.68-11.95-26.68-26.65zm146.61-45.3H46.89c-4.42 0-7.99-3.58-7.99-7.99s3.58-7.99 7.99-7.99H162.6c4.42 0 7.99 3.58 7.99 7.99s-3.58 7.99-7.99 7.99zm0 43.06H91.25c-4.42 0-7.99-3.58-7.99-7.99s3.58-7.99 7.99-7.99h71.35c4.42 0 7.99 3.58 7.99 7.99s-3.58 7.99-7.99 7.99z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
              </g>
            </svg>
          ),
        },
        {
          name: "Market sentiment Index",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              x="0"
              y="0"
              viewBox="0 0 1000 1000"
              xmlSpace="preserve"
            >
              <g>
                <path
                  d="M874.87 675.23a35.17 35.17 0 0 1-35.13-35.13c0-187.33-152.41-339.74-339.74-339.74S160.26 452.77 160.26 640.1a35.13 35.13 0 0 1-70.26 0 410 410 0 1 1 820 0 35.17 35.17 0 0 1-35.13 35.13zM500 280.36c198.36 0 359.74 161.38 359.74 359.74a15.13 15.13 0 0 0 30.26 0 390 390 0 1 0-780 0 15.13 15.13 0 0 0 30.26 0c0-198.36 161.38-359.74 359.74-359.74z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="M500 717a62.68 62.68 0 0 1-62.61-62.62c0-29.72 50.65-278.76 52.81-289.35a10 10 0 0 1 19.6 0c2.16 10.59 52.81 259.63 52.81 289.35A62.68 62.68 0 0 1 500 717zm0-299.3c-17.2 86.25-42.61 217.83-42.61 236.68a42.61 42.61 0 1 0 85.22 0c0-18.88-25.41-150.46-42.61-236.71z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="M500 769.9a101.25 101.25 0 0 1-47.48-190.68 10 10 0 0 1 9.39 17.66 81.25 81.25 0 1 0 76.18 0 10 10 0 0 1 9.39-17.66A101.25 101.25 0 0 1 500 769.9zM210.81 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM265.19 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM319.57 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM680.43 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM734.81 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM789.19 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
              </g>
            </svg>
          ),
        },
        {
          name: "Social Sentiment Analysis",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              x="0"
              y="0"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
            >
              <g>
                <path
                  d="M477.867 102.4c-18.825 0-34.133 15.309-34.133 34.133s15.309 34.133 34.133 34.133S512 155.358 512 136.533c0-18.824-15.309-34.133-34.133-34.133zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067 0-9.412 7.654-17.067 17.067-17.067s17.067 7.654 17.067 17.067c-.001 9.413-7.655 17.067-17.067 17.067zM34.133 384C15.309 384 0 399.309 0 418.133s15.309 34.133 34.133 34.133c18.825 0 34.133-15.309 34.133-34.133S52.958 384 34.133 384zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067s7.654-17.067 17.067-17.067c9.412 0 17.067 7.654 17.067 17.067S43.546 435.2 34.133 435.2z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="m461.321 113.186-73.617-35.541c-4.25-2.057-9.344-.265-11.392 3.977-2.048 4.241-.265 9.344 3.977 11.392l73.617 35.541a8.516 8.516 0 0 0 11.391-3.977c2.048-4.241.265-9.344-3.976-11.392zM384 443.733c-18.825 0-34.133 15.309-34.133 34.133S365.175 512 384 512c18.825 0 34.133-15.309 34.133-34.133S402.825 443.733 384 443.733zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067S374.588 460.8 384 460.8c9.412 0 17.067 7.654 17.067 17.067s-7.655 17.066-17.067 17.066z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="m367.454 454.52-73.617-35.541a8.517 8.517 0 0 0-11.392 3.977c-2.048 4.241-.265 9.344 3.977 11.392l73.617 35.541a8.519 8.519 0 0 0 11.392-3.977c2.047-4.242.264-9.344-3.977-11.392zM256 230.4c-18.825 0-34.133 15.309-34.133 34.133 0 18.825 15.309 34.133 34.133 34.133 18.825 0 34.133-15.309 34.133-34.133 0-18.824-15.308-34.133-34.133-34.133zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067 0-9.412 7.654-17.067 17.067-17.067 9.412 0 17.067 7.654 17.067 17.067S265.412 281.6 256 281.6z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="m240.998 242.142-56.55-44.075c-3.721-2.876-9.079-2.236-11.981 1.485-2.893 3.721-2.236 9.079 1.485 11.981l56.55 44.075a8.516 8.516 0 0 0 5.24 1.801 8.529 8.529 0 0 0 6.741-3.285c2.893-3.722 2.236-9.081-1.485-11.982zM409.6 221.867c-51.755 0-93.867 42.112-93.867 93.867s42.112 93.867 93.867 93.867 93.867-42.112 93.867-93.867-42.112-93.867-93.867-93.867zm0 170.666c-42.351 0-76.8-34.449-76.8-76.8s34.449-76.8 76.8-76.8 76.8 34.449 76.8 76.8-34.449 76.8-76.8 76.8z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="M409.6 256c-18.825 0-34.133 15.309-34.133 34.133 0 18.825 15.309 34.133 34.133 34.133 18.825 0 34.133-15.309 34.133-34.133S428.425 256 409.6 256zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067 0-9.412 7.654-17.067 17.067-17.067 9.412 0 17.067 7.654 17.067 17.067S419.012 307.2 409.6 307.2zM434.355 341.333h-49.51c-14.583 0-26.445 11.546-26.445 25.728v22.494a8.54 8.54 0 0 0 4.258 7.39C376.96 405.222 393.19 409.6 409.6 409.6s32.64-4.378 46.942-12.655a8.525 8.525 0 0 0 4.258-7.381V367.07c0-14.191-11.861-25.737-26.445-25.737zm9.378 43.136c-21.239 10.581-47.027 10.581-68.267 0V367.07c0-4.779 4.207-8.67 9.378-8.67h49.51c5.171 0 9.378 3.891 9.378 8.67v17.399zM204.8 324.267c-51.755 0-93.867 42.112-93.867 93.867S153.045 512 204.8 512s93.867-42.112 93.867-93.867-42.112-93.866-93.867-93.866zm0 170.666c-42.351 0-76.8-34.449-76.8-76.8s34.449-76.8 76.8-76.8 76.8 34.449 76.8 76.8-34.449 76.8-76.8 76.8z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="M204.8 358.4c-18.825 0-34.133 15.309-34.133 34.133 0 18.825 15.309 34.133 34.133 34.133s34.133-15.309 34.133-34.133c0-18.824-15.308-34.133-34.133-34.133zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067 0-9.412 7.654-17.067 17.067-17.067 9.412 0 17.067 7.654 17.067 17.067S214.212 409.6 204.8 409.6zM229.555 443.733h-49.51c-14.583 0-26.445 11.546-26.445 25.728v22.494a8.54 8.54 0 0 0 4.258 7.39C172.16 507.622 188.39 512 204.8 512s32.64-4.378 46.942-12.655a8.524 8.524 0 0 0 4.258-7.381V469.47c0-14.191-11.861-25.737-26.445-25.737zm9.378 43.136c-21.24 10.581-47.027 10.581-68.267 0V469.47c0-4.779 4.207-8.67 9.378-8.67h49.51c5.171 0 9.378 3.891 9.378 8.67v17.399zM93.867 110.933C42.112 110.933 0 153.045 0 204.8s42.112 93.867 93.867 93.867 93.867-42.112 93.867-93.867c-.001-51.755-42.113-93.867-93.867-93.867zm0 170.667c-42.351 0-76.8-34.449-76.8-76.8s34.449-76.8 76.8-76.8 76.8 34.449 76.8 76.8-34.449 76.8-76.8 76.8z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="M93.867 145.067c-18.825 0-34.133 15.309-34.133 34.133s15.309 34.133 34.133 34.133c18.825 0 34.133-15.309 34.133-34.133s-15.309-34.133-34.133-34.133zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067s7.654-17.067 17.067-17.067c9.412 0 17.067 7.654 17.067 17.067s-7.655 17.067-17.067 17.067zM118.622 230.4h-49.51c-14.583 0-26.445 11.546-26.445 25.728v22.494a8.54 8.54 0 0 0 4.258 7.39c14.302 8.277 30.532 12.655 46.942 12.655s32.64-4.378 46.942-12.655a8.525 8.525 0 0 0 4.258-7.381v-22.494c0-14.191-11.862-25.737-26.445-25.737zM128 273.536c-21.239 10.581-47.027 10.581-68.267 0v-17.399c0-4.779 4.207-8.67 9.378-8.67h49.51c5.171 0 9.378 3.891 9.378 8.67v17.399zM298.667 0C246.912 0 204.8 42.112 204.8 93.867s42.112 93.867 93.867 93.867 93.867-42.112 93.867-93.867C392.533 42.112 350.421 0 298.667 0zm0 170.667c-42.351 0-76.8-34.449-76.8-76.8s34.449-76.8 76.8-76.8 76.8 34.449 76.8 76.8-34.449 76.8-76.8 76.8z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="M298.667 34.133c-18.825 0-34.133 15.309-34.133 34.133s15.309 34.133 34.133 34.133S332.8 87.091 332.8 68.267s-15.309-34.134-34.133-34.134zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067 0-9.412 7.654-17.067 17.067-17.067s17.067 7.654 17.067 17.067c-.001 9.413-7.655 17.067-17.067 17.067zM323.422 119.467h-49.51c-14.583 0-26.445 11.546-26.445 25.728v22.494a8.54 8.54 0 0 0 4.258 7.39c14.302 8.277 30.532 12.655 46.942 12.655s32.64-4.378 46.942-12.655a8.525 8.525 0 0 0 4.258-7.381v-22.494c0-14.192-11.862-25.737-26.445-25.737zm9.378 43.136c-21.239 10.581-47.027 10.581-68.267 0v-17.399c0-4.779 4.207-8.67 9.378-8.67h49.51c5.171 0 9.378 3.891 9.378 8.67v17.399zM219.827 88.311c-3.063-3.567-8.448-3.994-12.032-.93l-59.136 50.603c-3.584 3.063-4.002 8.448-.939 12.032a8.52 8.52 0 0 0 12.032.93l59.136-50.603c3.585-3.063 4.003-8.448.939-12.032z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="m407.893 225.289-51.2-68.267c-2.825-3.78-8.175-4.523-11.947-1.707-3.772 2.825-4.531 8.175-1.707 11.938l51.2 68.267a8.528 8.528 0 0 0 6.835 3.413 8.503 8.503 0 0 0 5.112-1.707c3.772-2.824 4.532-8.174 1.707-11.937zM337.86 343.953c-2.825-3.772-8.175-4.531-11.947-1.707l-47.667 35.746c-3.772 2.825-4.531 8.175-1.707 11.938a8.528 8.528 0 0 0 6.835 3.413 8.54 8.54 0 0 0 5.112-1.707l47.667-35.746c3.772-2.823 4.532-8.174 1.707-11.937zM119.467 409.6H59.733c-4.71 0-8.533 3.814-8.533 8.533s3.823 8.533 8.533 8.533h59.733c4.71 0 8.533-3.814 8.533-8.533s-3.822-8.533-8.532-8.533zM93.867 0C75.042 0 59.733 15.309 59.733 34.133c0 18.825 15.309 34.133 34.133 34.133 18.825 0 34.133-15.309 34.133-34.133C128 15.309 112.691 0 93.867 0zm0 51.2c-9.412 0-17.067-7.654-17.067-17.067 0-9.412 7.654-17.067 17.067-17.067 9.412 0 17.067 7.654 17.067 17.067-.001 9.413-7.655 17.067-17.067 17.067z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
                <path
                  d="M93.867 51.2a8.53 8.53 0 0 0-8.533 8.533v59.733a8.53 8.53 0 0 0 8.533 8.533 8.53 8.53 0 0 0 8.533-8.533V59.733a8.53 8.53 0 0 0-8.533-8.533z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
              </g>
            </svg>
          ),
        },
        {
          name: "Yield Optimizer",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              x="0"
              y="0"
              viewBox="0 0 682.667 682.667"
              xmlSpace="preserve"
            >
              <g>
                <defs>
                  <clipPath id="a" clipPathUnits="userSpaceOnUse">
                    <path
                      d="M0 512h512V0H0Z"
                      fill="#fff"
                      opacity="1"
                      data-original="#fff"
                    ></path>
                  </clipPath>
                </defs>
                <g
                  clipPath="url(#a)"
                  transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
                >
                  <path
                    d="M0 0c0 10.315-.9 20.42-2.612 30.246l61.994 35.793-60 103.922-62.02-35.807c-15.421 12.93-33.097 23.256-52.362 30.287V236h-120v-71.559c-19.265-7.031-36.941-17.357-52.362-30.287l-62.02 35.807-60-103.922 61.994-35.793A176.095 176.095 0 0 1-350 0c0-10.315.9-20.42 2.612-30.246l-61.994-35.793 60-103.922 62.02 35.807c15.421-12.93 33.097-23.256 52.362-30.287V-236h120v71.559c19.265 7.031 36.941 17.357 52.362 30.287l62.02-35.807 60 103.922-61.994 35.793A176.095 176.095 0 0 1 0 0Z"
                    transform="translate(431 256)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="40"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeDasharray="none"
                    strokeOpacity=""
                    data-original="#fff"
                  ></path>
                  <path
                    d="M0 0c-22.056 0-40 17.944-40 40s17.944 40 40 40 40-17.944 40-40S22.056 0 0 0"
                    transform="translate(256 216)"
                    fill="#fff"
                    data-original="#fff"
                  ></path>
                  <path
                    d="m0 0-82.272-47.5"
                    transform="translate(338.272 303.5)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="40"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeDasharray="none"
                    strokeOpacity=""
                    data-original="#fff"
                  ></path>
                  <path
                    d="M0 0c-52.383 0-95-42.617-95-95s42.617-95 95-95c36.643 0 68.503 20.856 84.344 51.319"
                    transform="translate(256 351)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="40"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeDasharray="none"
                    strokeOpacity=""
                    data-original="#fff"
                  ></path>
                </g>
              </g>
            </svg>
          ),
        },
        {
          name: "Bridge",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              x="0"
              y="0"
              viewBox="0 0 24 24"
              xmlSpace="preserve"
            >
              <g>
                <path
                  d="M22 17.5h-4c-.6 0-1-.4-1-1 0-2.8-2.2-5-5-5s-5 2.2-5 5c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1v-7c0-.4.3-.8.7-.9.2-.1 6.2-2.1 10.3-2.1s10.1 2 10.3 2.1c.4.1.7.5.7.9v7c0 .6-.4 1-1 1zm-3.1-2H21v-5.3c-1.7-.5-6-1.7-9-1.7s-7.3 1.2-9 1.7v5.3h2.1c.5-3.4 3.4-6 6.9-6s6.4 2.6 6.9 6z"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                ></path>
              </g>
            </svg>
          ),
        },
        {
          name: "Airdrop Tracker",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              x="0"
              y="0"
              viewBox="0 0 682.667 682.667"
              xmlSpace="preserve"
            >
              <g>
                <defs>
                  <clipPath id="b" clipPathUnits="userSpaceOnUse">
                    <path
                      d="M0 512h512V0H0Z"
                      fill="#fff"
                      opacity="1"
                      data-original="#fff"
                    ></path>
                  </clipPath>
                </defs>
                <mask id="a">
                  <rect
                    width="100%"
                    height="100%"
                    fill="#ffffff"
                    opacity="1"
                    data-original="#ffffff"
                  ></rect>
                </mask>
                <g mask="url(#a)">
                  <g
                    clipPath="url(#b)"
                    transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
                  >
                    <path
                      d="M181 14.896h150v150H181Z"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="30"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray="none"
                      strokeOpacity=""
                      data-original="#fff"
                    ></path>
                    <path
                      d="m0 0 65 137.207c0 107.696-29.102 195-65 195-35.898 0-65-87.304-65-195L0 0"
                      transform="translate(256 164.896)"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="30"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray="none"
                      strokeOpacity=""
                      data-original="#fff"
                    ></path>
                    <path
                      d="M0 0c35.928 35.928 94.072 35.928 130 0 35.928 35.928 94.072 35.928 130 0 35.928 35.928 94.072 35.928 130 0"
                      transform="translate(61 302.103)"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="30"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray="none"
                      strokeOpacity=""
                      data-original="#fff"
                    ></path>
                    <path
                      d="m0 0 195 137.207c0 107.696-87.304 195-195 195-107.695 0-195-87.304-195-195L0 0"
                      transform="translate(256 164.896)"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="30"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray="none"
                      strokeOpacity=""
                      data-original="#fff"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          ),
        },
      ],
    },
    EDUCATION: {
      id: 4,
      title: "Learning Center",
      description: "Educational resources and tutorials",
      items: [
        {
          name: "User Profiles",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              x="0"
              y="0"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              className=""
            >
              <g>
                <path
                  d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                  fill="#fff"
                  opacity="1"
                  data-original="#fff"
                  className=""
                ></path>
              </g>
            </svg>
          ),
        },
        {
          name: "Leaderboards",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              x="0"
              y="0"
              viewBox="0 0 24 24"
              xmlSpace="preserve"
              className=""
            >
              <g>
                <g fill="#28303f">
                  <path
                    d="M11 8.75h2v-1.5h-2zM14.25 10v10h1.5V10zM13 21.25h-2v1.5h2zM9.75 20V10h-1.5v10zM11 21.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 11 22.75zM14.25 20c0 .69-.56 1.25-1.25 1.25v1.5A2.75 2.75 0 0 0 15.75 20zM13 8.75c.69 0 1.25.56 1.25 1.25h1.5A2.75 2.75 0 0 0 13 7.25zm-2-1.5A2.75 2.75 0 0 0 8.25 10h1.5c0-.69.56-1.25 1.25-1.25zm6 7.5h2v-1.5h-2zM20.25 16v4h1.5v-4zM19 21.25h-2v1.5h2zM15.75 20v-4h-1.5v4zM17 21.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 17 22.75zM20.25 20c0 .69-.56 1.25-1.25 1.25v1.5A2.75 2.75 0 0 0 21.75 20zM19 14.75c.69 0 1.25.56 1.25 1.25h1.5A2.75 2.75 0 0 0 19 13.25zm-2-1.5A2.75 2.75 0 0 0 14.25 16h1.5c0-.69.56-1.25 1.25-1.25zm-12-.5h2v-1.5H5zM8.25 14v6h1.5v-6zM7 21.25H5v1.5h2zM3.75 20v-6h-1.5v6zM5 21.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 5 22.75zM8.25 20c0 .69-.56 1.25-1.25 1.25v1.5A2.75 2.75 0 0 0 9.75 20zM7 12.75c.69 0 1.25.56 1.25 1.25h1.5A2.75 2.75 0 0 0 7 11.25zm-2-1.5A2.75 2.75 0 0 0 2.25 14h1.5c0-.69.56-1.25 1.25-1.25zM11.524 1.964a.5.5 0 0 1 .952 0l.156.482a.5.5 0 0 0 .476.346h.508a.5.5 0 0 1 .293.904l-.41.299a.5.5 0 0 0-.182.559l.157.482a.5.5 0 0 1-.77.56l-.41-.299a.5.5 0 0 0-.588 0l-.41.298a.5.5 0 0 1-.77-.559l.157-.482a.5.5 0 0 0-.182-.56l-.41-.298a.5.5 0 0 1 .294-.904h.507a.5.5 0 0 0 .476-.346z"
                    fill="#fff"
                    opacity="1"
                    data-original="#fff"
                    className=""
                  ></path>
                </g>
              </g>
            </svg>
          ),
        },        
      ],
    },
  };

  // Audio initialization and welcome experience
  const songs: Song[] = [
    { name: "BONES feat. Juicy J - Timberlake (Tommy Braun Remix)", file: "/music/2.mp3", cover: "/covers/2.jpg" },
    { name: "BONES - LooseScrew (feat. Eddy Baker)", file: "/music/1.mp3", cover: "/covers/1.jpg" },
    { name: "Omiki - Na Le (Phaxe Remix)", file: "/music/3.mp3", cover: "/covers/3.jpg" },
    { name: "Noga Erez - Quiet (Lyrics) (From Heart of Stone)", file: "/music/4.mp3", cover: "/covers/4.jpg" },
    { name: "Tarang", file: "/music/5.mp3", cover: "/covers/5.jpg" },
  ];

  const handleAddNewFolder = () => {
    const newFolder: Icon = {
      id: Date.now().toString(),
      name: "My Files",
      icon: "📁",
      type: "folder",
    };

    const newIcons = [...icons, newFolder];
    setIcons(newIcons);

    localStorage.setItem("icons", JSON.stringify(newIcons));
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Load saved icons from localStorage
  useEffect(() => {
    const savedIcons = localStorage.getItem("icons");
    if (savedIcons) {
      setIcons(JSON.parse(savedIcons));
    }
  }, []);

  // Save icons to localStorage when updated
  useEffect(() => {
    localStorage.setItem("icons", JSON.stringify(icons));
  }, [icons]);

  // Initialize audioRef
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle song playback and switching
  useEffect(() => {
    if (isAudioStarted && audioRef.current) {
      audioRef.current.src = songs[songIndex].file;
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [songIndex, isAudioStarted]);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const handleSongEnd = async () => {
        try {
          await handleNextSong();
        } catch (error) {
          console.error("Error handling song end:", error);
        }
      };

      audioRef.current.addEventListener("ended", handleSongEnd);

      return () => {
        audioRef.current?.removeEventListener("ended", handleSongEnd);
      };
    }
  }, [songIndex]);

  // Start experience (Welcome screen)
  const startExperience = async () => {
    setShowWelcome(false);
    setIsAudioStarted(true);

    try {
      if (songs.length > 0 && audioRef.current) {
        const firstSong = songs[0];
        setCurrentSong(firstSong);
        setSongIndex(0);

        audioRef.current.src = firstSong.file;

        await audioRef.current.load();

        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio play after click enter failed:", error);
      setIsPlaying(false);
    }
  };
  const handleItemClick = (e: React.MouseEvent, item: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSelectedItem(item.name); 
    setIsModalOpen(true);   };

  const handleNextSong = async () => {
    const nextIndex = (songIndex + 1) % songs.length;
    const nextSong = songs[nextIndex];

    try {
      if (audioRef.current) {
        await audioRef.current.pause(); 
        setSongIndex(nextIndex); 
        setCurrentSong(nextSong); 

        audioRef.current.src = nextSong.file; 
        await audioRef.current.load(); 
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing next song:", error);
      setIsPlaying(false);
    }
  };

  const filteredItems = Object.entries(tabContents)
    .flatMap(([categoryKey, category]) =>
      category.items.map((item) => ({
        ...item,
        categoryName: category.title,      }))
    )
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

  const handlePrevSong = async () => {
    const prevIndex = (songIndex - 1 + songs.length) % songs.length;
    const prevSong = songs[prevIndex];

    try {
      if (audioRef.current) {
        await audioRef.current.pause();         setSongIndex(prevIndex);
        setCurrentSong(prevSong); 

        audioRef.current.src = prevSong.file; 
        await audioRef.current.load();
        await audioRef.current.play(); 
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing previous song:", error);
      setIsPlaying(false);
    }
  };

  const handleSongClick = async (song: Song, index: number) => {
    try {
      if (audioRef.current) {
        await audioRef.current.pause(); 
        setIsPlaying(false); 
        setCurrentSong(song); 
        setSongIndex(index); 
        audioRef.current.src = song.file; 

        await audioRef.current.load(); 
        await audioRef.current.play(); 
        setIsPlaying(true); 
      }
    } catch (error) {
      console.error("Playback failed:", error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (audioRef.current) {
        if (isPlaying) {
          await audioRef.current.pause(); 
          setIsPlaying(false); 
        } else {
          await audioRef.current.play(); 
          setIsPlaying(true); 
        }
      }
    } catch (error) {
      console.error("Play/Pause toggle failed:", error);
    }
  };

  // Clock update effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateClock(); // Update immediately
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current && !audioContextRef.current) {
      try {
        const context = new AudioContext();
        const source = context.createMediaElementSource(audioRef.current);
        const analyzer = context.createAnalyser();

        source.connect(analyzer);
        analyzer.connect(context.destination);

        analyzer.fftSize = 256;
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);

        const animate = () => {
          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          const normalizedScale = 1 + (average / 255) * 0.3; // تقویت تغییرات
          setScale(normalizedScale);

          animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        audioContextRef.current = context;
      } catch (error) {
        console.error("AudioContext initialization failed:", error);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef]);

  useEffect(() => {
    if (audioRef.current) {
      const handlePlay = () => {
        if (audioContextRef.current?.state === "suspended") {
          audioContextRef.current.resume(); 
        }
      };

      audioRef.current.addEventListener("play", handlePlay);

      return () => {
        audioRef.current?.removeEventListener("play", handlePlay);
      };
    }
  }, [audioRef]);

  const leftSidebarButtons = [
    {
      icon: <Grid className="w-6 h-6" />,
      action: () => setShowApps(!showApps),
    },
    {
      icon: <Music className="w-6 h-6" />,
      action: () => setShowMusicPlayer(!showMusicPlayer),
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      action: () => setShowTerminal(!showTerminal),
    },
  ];

  const renderMusicPlayerMini = () => (
    <div className="flex items-center gap-2 px-2">
      <div className="w-8 h-8 rounded overflow-hidden">
        <img
          src={currentSong.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center gap-1">
        <button onClick={togglePlayPause}>
          {isPlaying ? (
            <PauseCircle className="w-4 h-4" />
          ) : (
            <PlayCircle className="w-4 h-4" />
          )}
        </button>
        <span className="text-sm truncate max-w-[120px]">
          {currentSong.name}
        </span>
      </div>
    </div>
  );

  return (
    <div
      className="h-screen relative overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {contextMenu && (
          <div
            className="fixed bg-black border border-[#B1B762] rounded-lg py-2 px-4 z-50"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button
              onClick={handleAddNewFolder}
              className="text-[#B1B762] hover:text-white whitespace-nowrap"
            >
              Add New Folder
            </button>
          </div>
        )}

        <img
          src="/background.jpg"
          alt="Space Background"
          className="w-full h-full object-cover"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      </div>
      {/* Top Bar */}
      <div className="relative z-10 bg-black bg-opacity-80 p-2 flex justify-between items-center">
        <div className="flex-1">
          <span className="text-[#B1B762]">CA:TBA</span>
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-[#B1B762]">{currentTime}</span>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4 text-[#B1B762]">
          {isPlaying && renderMusicPlayerMini()}
          <Wifi className="w-4 h-4" />
          <div className="flex items-center gap-1">
            {isCharging && <span>⚡</span>}
            <Battery className="w-4 h-4" />
            <span className="text-xs">{Math.round(batteryLevel)}%</span>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="fixed left-0 top-12 bottom-0 w-16 bg-black bg-opacity-80 flex flex-col items-center py-4 gap-4 z-10">
        {leftSidebarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className="text-[#B1B762] p-2 rounded"
          >
            {button.icon}
          </button>
        ))}
        <div className="flex flex-col space-y-4">
          {icons.map((icon) => (
            <div key={icon.id} className="text-center">
              {icon.type === "static" ? (
                <button
                  onClick={() => icon.url && window.open(icon.url, "_blank")}
                  className="text-[#B1B762] p-2 rounded"
                >
                  <img
                    src={icon.icon}
                    alt={icon.name}
                    className="w-6 h-6 object-contain"
                  />
                </button>
              ) : (              
                <button
                  className="w-12 h-12 flex items-center justify-center rounded"
                  onClick={() => setIsFolderModalOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-folder w-6 h-6 text-[#B1B762]"
                  >
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Apps Menu */}
      {showApps && (
        <div className="fixed inset-0 bg-black bg-opacity-90 pt-12 pl-16 z-30">
          <div className="p-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => {
                  if (selectedCategory !== "All") {
                    setSelectedCategory("All");
                  } else {
                    setShowApps(false);
                  }
                }}
                className="text-[#B1B762] hover:text-white p-2 rounded"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B1B762]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applications..."
                  className="w-full bg-black border border-[#B1B762] rounded-full py-2 px-10 text-[#B1B762]"
                />
              </div>
            </div>

            {searchQuery ? (
              <div className="grid grid-cols-6 gap-4">
                {filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer hover:bg-[#B1B762] hover:bg-opacity-20 text-white"
                    onClick={(e) => handleItemClick(e, item)}
                  >
                    {item.icon}
                    <span className="text-[#B1B762] text-sm text-center">
                      {item.name}
                    </span>
                    <span className="text-[#B1B762] text-xs opacity-60">
                      {item.categoryName}
                    </span>
                  </div>
                ))}
              </div>
            ) : selectedCategory === "All" ? (
              <div>
                {Object.entries(tabContents).map(([key, category]) => (
                  <div key={key} className="mb-6 ">
                    <h3 className="text-[#B1B762] text-lg mb-4">
                      {category.title}
                    </h3>
                    <div className="grid grid-cols-6 gap-4">
                      {category.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg cursor-pointer hover:bg-[#B1B762] hover:bg-opacity-20 text-white"
                          onClick={(e) => handleItemClick(e, item)}
                        >
                          {item.icon}
                          <span className="text-[#B1B762] text-sm text-center">
                            {item.name}
                          </span>
                        </div>
                      ))}
                      <div
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white relative bg-[#B1B762]"
                        style={{
                          filter: "blur(5px)", 
                          opacity: 0.5, 
                          pointerEvents: "none", 
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width="24"
                          height="24"
                          x="0"
                          y="0"
                          viewBox="0 0 1000 1000"
                          xmlSpace="preserve"
                        >
                          <g>
                            <path
                              d="M874.87 675.23a35.17 35.17 0 0 1-35.13-35.13c0-187.33-152.41-339.74-339.74-339.74S160.26 452.77 160.26 640.1a35.13 35.13 0 0 1-70.26 0 410 410 0 1 1 820 0 35.17 35.17 0 0 1-35.13 35.13zM500 280.36c198.36 0 359.74 161.38 359.74 359.74a15.13 15.13 0 0 0 30.26 0 390 390 0 1 0-780 0 15.13 15.13 0 0 0 30.26 0c0-198.36 161.38-359.74 359.74-359.74z"
                              fill="#fff"
                              opacity="1"
                              data-original="#fff"
                            ></path>
                            <path
                              d="M500 717a62.68 62.68 0 0 1-62.61-62.62c0-29.72 50.65-278.76 52.81-289.35a10 10 0 0 1 19.6 0c2.16 10.59 52.81 259.63 52.81 289.35A62.68 62.68 0 0 1 500 717zm0-299.3c-17.2 86.25-42.61 217.83-42.61 236.68a42.61 42.61 0 1 0 85.22 0c0-18.88-25.41-150.46-42.61-236.71z"
                              fill="#fff"
                              opacity="1"
                              data-original="#fff"
                            ></path>
                            <path
                              d="M500 769.9a101.25 101.25 0 0 1-47.48-190.68 10 10 0 0 1 9.39 17.66 81.25 81.25 0 1 0 76.18 0 10 10 0 0 1 9.39-17.66A101.25 101.25 0 0 1 500 769.9zM210.81 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM265.19 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM319.57 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM680.43 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM734.81 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10zM789.19 675.23a10 10 0 0 1-10-10v-63a10 10 0 0 1 20 0v63a10 10 0 0 1-10 10z"
                              fill="#fff"
                              opacity="1"
                              data-original="#fff"
                            ></path>
                          </g>
                        </svg>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h3 className="text-[#B1B762] text-xl mb-4">
                  {selectedCategory}
                </h3>
                <div className="grid grid-cols-6 gap-4">
                  {Object.values(tabContents)
                    .find((category) => category.title === selectedCategory)
                    ?.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer hover:bg-[#B1B762] hover:bg-opacity-20"
                        onClick={(e) => handleItemClick(e, item)}
                      >
                        {item.icon}
                        <span className="text-[#B1B762] text-sm">
                          {item.name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Music Player */}
      {showMusicPlayer && (
        <div className="fixed right-4 top-16 p-4 rounded-lg shadow-lg w-96 z-40 bg-black border border-[#B1B762]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#B1B762]">Music Player</h3>
            <button
              onClick={() => setShowMusicPlayer(false)}
              className="text-[#B1B762]"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
              <img
                src={currentSong.cover}
                alt="Album Cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center mb-4">
              <h4 className="text-[#B1B762] text-lg">{currentSong.name}</h4>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={handlePrevSong}
                className="text-[#B1B762] hover:text-white transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              <button
                onClick={togglePlayPause}
                className="text-[#B1B762] hover:text-white transition-colors"
              >
                {isPlaying ? (
                  <PauseCircle className="w-8 h-8" />
                ) : (
                  <PlayCircle className="w-8 h-8" />
                )}
              </button>
              <button
                onClick={handleNextSong}
                className="text-[#B1B762] hover:text-white transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setVolume(0)} className="text-[#B1B762]">
                {volume === 0 ? (
                  <VolumeX />
                ) : volume < 50 ? (
                  <Volume1 />
                ) : (
                  <Volume2 />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-[#B1B762]"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {songs.map((song, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  currentSong.name === song.name
                    ? "bg-[#B1B762] text-black"
                    : "text-[#B1B762] hover:bg-[#B1B762] hover:bg-opacity-20"
                }`}
                onClick={() => {
                  
                  handleSongClick(song, index);
                
                }}
              >
                <img
                  src={song.cover}
                  alt={song.name}
                  className="w-8 h-8 rounded"
                />
                <span>{song.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

<WelcomeModal showWelcome={showWelcome} startExperience={startExperience} />

      {/* Modal for category items */}
      {isModalOpen && selectedItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          title={selectedItem}
          clickPosition={clickPosition}
        >
          {selectedItem &&
            React.createElement(TabItemComponents[selectedItem], {
              onClose: () => setIsModalOpen(false),
            })}
        </Modal>
      )}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setClickPosition(null);
        }}
        title="File System"
        clickPosition={clickPosition}
      />
      {showTerminal && (
        <div className="max-w-[500px]">
          <LinuxTerminal onClose={() => setShowTerminal(false)} />
        </div>
      )}
    </div>
  );
};

export default SpaceUbuntuDesktop;
