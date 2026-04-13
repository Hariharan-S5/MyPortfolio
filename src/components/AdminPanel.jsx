import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, X, Link, Image, Calendar, Tag, FileText, GraduationCap, Award, Layout, Download, Bot, Edit3, UploadCloud, Briefcase, User, Settings, Eye, EyeOff, CheckCircle2, AlertCircle, Lock, ArrowLeft, Sun, Moon, ExternalLink, HelpCircle } from 'lucide-react';
import metadata from '../data/metadata.json';
import { getAssetUrl } from '../utils/assetUrl';

// Helper to ensure metadata has a valid structure even if the file is minimal/empty
const scaffoldMetadata = (raw) => {
  const data = JSON.parse(JSON.stringify(raw || {}));
  return {
    name: data.name || "",
    title: data.title || "",
    subtitle: data.subtitle || "",
    location: data.location || "",
    about: data.about || "",
    profileImage: data.profileImage || "",
    resume: data.resume || "",
    education: data.education || [],
    skills: data.skills || [],
    experience: data.experience || [],
    achievements: data.achievements || [],
    certificates: data.certificates || [],
    projects: data.projects || [],
    contact: {
      github: data.contact?.github || "",
      linkedin: data.contact?.linkedin || "",
      email: data.contact?.email || "",
      instagram: data.contact?.instagram || "",
      leetcode: data.contact?.leetcode || ""
    },
    sections: {
      about: { title: data.sections?.about?.title || "About Me", show: data.sections?.about?.show !== false },
      hero: { greeting: data.sections?.hero?.greeting || "Hi, I'm", show: data.sections?.hero?.show !== false },
      experience: { title: data.sections?.experience?.title || "Work Experience", show: data.sections?.experience?.show !== false },
      achievements: { title: data.sections?.achievements?.title || "Achievements", show: data.sections?.achievements?.show !== false },
      education: { title: data.sections?.education?.title || "Education", show: data.sections?.education?.show !== false },
      projects: { title: data.sections?.projects?.title || "Featured Projects", subtitle: data.sections?.projects?.subtitle || "", show: data.sections?.projects?.show !== false },
      certificates: { title: data.sections?.certificates?.title || "Certificates", subtitle: data.sections?.certificates?.subtitle || "", show: data.sections?.certificates?.show !== false },
      contact: { title: data.sections?.contact?.title || "Get in Touch", subtitle: data.sections?.contact?.subtitle || "", show: data.sections?.contact?.show !== false },
      skills: { title: data.sections?.skills?.title || "Technical Arsenal", subtitle: data.sections?.skills?.subtitle || "", show: data.sections?.skills?.show !== false }
    }
  };
};

export default function AdminPanel({ onClose }) {
  const isDevelopment = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
  const [editMode, setEditMode] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isDragging, setIsDragging] = useState(false);
  const [autoResumeFile, setAutoResumeFile] = useState(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAutoResumeFile(e.dataTransfer.files[0]);
    }
  };

  const [draftData, setDraftData] = useState(scaffoldMetadata(metadata));
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const [enableGeminiEdit, setEnableGeminiEdit] = useState(false);
  const [enableVisibilityEdit, setEnableVisibilityEdit] = useState(false);
  const [enableAdminAccessEdit, setEnableAdminAccessEdit] = useState(false);
  const [enableThemeEdit, setEnableThemeEdit] = useState(false);
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [adminAccessKey, setAdminAccessKey] = useState("");
  const [showAdminAccessKey, setShowAdminAccessKey] = useState(false);
  const [isUpdatingAccessKey, setIsUpdatingAccessKey] = useState(false);
  
  // Use a separate state for the onboarding input to prevent premature transition
  const [onboardingGeminiKey, setOnboardingGeminiKey] = useState("");
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const calculateHealth = () => {
    let score = 0;
    
    // 1. Profile (20%)
    const profileFields = ['name', 'title', 'location', 'about', 'profileImage'];
    const filledProfile = profileFields.filter(f => draftData[f] && draftData[f].length > 0).length;
    score += (filledProfile / profileFields.length) * 20;

    // 2. Skills (10%) - Expect at least 5
    if (draftData.skills && draftData.skills.length > 0) {
      score += Math.min(10, (draftData.skills.length / 5) * 10);
    }

    // 3. Experience (15%) - At least one with description
    if (draftData.experience && draftData.experience.length > 0) {
      const hasContent = draftData.experience[0].description ? 1 : 0.5;
      score += 15 * hasContent;
    }

    // 4. Projects (20%) - At least 2
    if (draftData.projects && draftData.projects.length > 0) {
      const projectCount = Math.min(2, draftData.projects.length);
      score += (projectCount / 2) * 20;
    }

    // 5. Achievements (10%)
    if (draftData.achievements && draftData.achievements.length > 0) score += 10;

    // 6. Education (15%)
    if (draftData.education && draftData.education.length > 0) score += 15;

    // 7. Certificates (10%)
    if (draftData.certificates && draftData.certificates.length > 0) score += 10;

    return Math.round(score);
  };

  const [stats, setStats] = useState({ dailyRequests: 0, lastReset: "" });
  const [theme, setTheme] = useState('light');
  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubBranch, setGithubBranch] = useState("main");
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [isUpdatingGithub, setIsUpdatingGithub] = useState(false);
  const [enableGithubEdit, setEnableGithubEdit] = useState(false);
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ type: '', text: '', url: '' });
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  
  // Fetch config on mount
  React.useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.geminiKey) {
          setGeminiKey(data.geminiKey);
          setIsKeyVerified(true); 
        }
        if (data.adminAccessKey) {
          setAdminAccessKey(data.adminAccessKey);
        }
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.github) {
          setGithubToken(data.github.token || "");
          setGithubRepo(data.github.repo || "");
          setGithubBranch(data.github.branch || "main");
        }
        if (data.theme) {
          setTheme(data.theme);
          if (data.theme === 'dark') {
             document.documentElement.classList.add('dark');
          } else {
             document.documentElement.classList.remove('dark');
          }
        }
      })
      .catch(err => console.error('Failed to fetch config:', err));
  }, []);

  const handleUpdateGithubConfig = async () => {
    setIsUpdatingGithub(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          github: { token: githubToken, repo: githubRepo, branch: githubBranch } 
        })
      });
      if (res.ok) setSaveMessage("GitHub configuration updated!");
    } catch (err) {
      setSaveMessage("Failed to update GitHub config.");
    } finally {
      setIsUpdatingGithub(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleSyncToGitHub = async () => {
    setIsSyncingGithub(true);
    setSyncStatus({ type: 'loading', text: 'Synchronizing with GitHub...' });
    try {
      const res = await fetch('/api/sync-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken, repo: githubRepo, branch: githubBranch })
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatus({ type: 'success', text: 'Sync Successful! Portfolio deployed.', url: data.commit });
      } else {
        throw new Error(data.error || "Sync failed");
      }
    } catch (err) {
      setSyncStatus({ type: 'error', text: err.message });
    } finally {
      setIsSyncingGithub(false);
    }
  };

  const handleUpdateTheme = async (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme })
      });
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  const handleVerifyKey = async () => {
    if (!geminiKey) return;
    setIsVerifying(true);
    setSaveMessage("Verifying Gemini API Key...");
    try {
      const response = await fetch('/api/verify-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiKey })
      });
      const result = await response.json();
      if (result.success) {
        setIsKeyVerified(true);
        setSaveMessage("API Key verified successfully!");
      } else {
        setIsKeyVerified(false);
        setSaveMessage(result.error || "Failed to verify API Key.");
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Error connecting to verification server.");
      setIsKeyVerified(false);
    } finally {
      setIsVerifying(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleUpdateGeminiConfig = async () => {
    setIsUpdatingKey(true);
    setSaveMessage("Updating Gemini API Key...");
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiKey })
      });
      const result = await response.json();
      if (result.success) {
        setSaveMessage("API Key updated successfully!");
      } else {
        setSaveMessage("Failed to update API Key.");
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Error updating configuration.");
    } finally {
      setIsUpdatingKey(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleUpdateAccessKey = async () => {
    if (!adminAccessKey) return;
    setIsUpdatingAccessKey(true);
    setSaveMessage("Updating Admin Access Key...");
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminAccessKey })
      });
      const result = await response.json();
      if (result.success) {
        setSaveMessage("Access Key updated successfully!");
        setEnableAdminAccessEdit(false);
      } else {
        setSaveMessage("Failed to update Access Key.");
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Error updating security config.");
    } finally {
      setIsUpdatingAccessKey(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleProcessWithAI = () => {
    if (!autoResumeFile) return;
    setIsProcessingAI(true);
    setSaveMessage("Parsing resume with AI... Please wait.");
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result;
        const response = await fetch('/api/parse-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64 })
        });
        const result = await response.json();
        
        if (result.success && result.data) {
          const aiData = result.data;
          
          setDraftData(prev => {
             const newData = { ...prev };
             if (aiData.name) newData.name = aiData.name;
             if (aiData.title) newData.title = aiData.title;
             if (aiData.location) newData.location = aiData.location;
             if (aiData.about) newData.about = aiData.about;
             
             if (aiData.skills && aiData.skills.length > 0) {
               newData.skills = [...new Set([...(newData.skills || []), ...aiData.skills])];
             }
             
             if (aiData.education && aiData.education.length > 0) {
               const newEdus = aiData.education.map(e => ({ ...e, timestamp: Math.floor(Date.now() / 1000), _isEditable: true }));
               newData.education = [...newEdus, ...((newData.education || []).map(e => ({...e, _isEditable: true}))) ];
             }

             if (aiData.experience && aiData.experience.length > 0) {
               const newExps = aiData.experience.map(x => ({ ...x, timestamp: Math.floor(Date.now() / 1000), _isEditable: true }));
               newData.experience = [...newExps, ...((newData.experience || []).map(x => ({...x, _isEditable: true}))) ];
             }
             
             if (aiData.projects && aiData.projects.length > 0) {
               const newProjs = aiData.projects.map(p => ({ 
                 ...p, 
                 liveLink: "", codeLink: "", image: "", isClickable: false, isCodeClickable: false,
                 timestamp: Math.floor(Date.now() / 1000), _isEditable: true 
               }));
               newData.projects = [...newProjs, ...((newData.projects || []).map(p => ({...p, _isEditable: true}))) ];
             }

             if (aiData.contact) {
               newData.contact = { ...(newData.contact || {}), ...aiData.contact };
             }

             return newData;
          });
          
          setSaveMessage("Finished! Review your updated details.");
          setEditMode('manual');
          setAutoResumeFile(null);
          
          // Refresh stats to update the live counter
          const configRes = await fetch('/api/config');
          const configData = await configRes.json();
          if (configData.stats) setStats(configData.stats);

          setTimeout(() => setSaveMessage(""), 4000);
        } else {
          setSaveMessage(result.error || "AI parsing failed.");
          setTimeout(() => setSaveMessage(""), 4000);
        }
      } catch (err) {
        console.error(err);
        setSaveMessage("Error processing document.");
        setTimeout(() => setSaveMessage(""), 4000);
      } finally {
        setIsProcessingAI(false);
      }
    };
    reader.readAsDataURL(autoResumeFile);
  };

  const [enableIdentityEdit, setEnableIdentityEdit] = useState(false);
  const [enableContactEdit, setEnableContactEdit] = useState(false);
  const [enableMediaEdit, setEnableMediaEdit] = useState(false);
  const [enableSectionsEdit, setEnableSectionsEdit] = useState(false);

  // Resume handlers
  const handleResumeChange = (e) => {
    setDraftData({ ...draftData, resume: e.target.value });
  };

  // Skills handlers
  const [newSkill, setNewSkill] = useState("");
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;

    const exists = draftData.skills.some(
      s => s.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (exists) {
      setSaveMessage(`Skill "${trimmedSkill}" is already added.`);
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    setDraftData({ ...draftData, skills: [...(draftData.skills || []), trimmedSkill] });
    setRecentlyAdded([...recentlyAdded, trimmedSkill]);
    setNewSkill("");
    setSaveMessage(`Skill added successfully!`);
    setTimeout(() => setSaveMessage(""), 3000);
  };
  const handleRemoveSkill = (skillToRemove) => {
    setDraftData({ ...draftData, skills: (draftData.skills || []).filter(s => s !== skillToRemove) });
    setRecentlyAdded(recentlyAdded.filter(s => s !== skillToRemove));
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProject = {
      title: "",
      description: "",
      tech: [],
      liveLink: "",
      codeLink: "",
      image: "",
      category: "Web Development",
      timestamp: Math.floor(Date.now() / 1000),
      isClickable: false,
      isCodeClickable: false,
      _isEditable: true
    };
    setDraftData({ ...draftData, projects: [newProject, ...(draftData.projects || [])] });
  };

  const handleUpdateProject = (index, field, value) => {
    const updatedProjects = [...(draftData.projects || [])];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setDraftData({ ...draftData, projects: updatedProjects });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp = {
      company: "",
      role: "",
      duration: "",
      description: "",
      timestamp: Math.floor(Date.now() / 1000),
      _isEditable: true
    };
    setDraftData({ ...draftData, experience: [newExp, ...(draftData.experience || [])] });
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...(draftData.experience || [])];
    updated[index] = { ...updated[index], [field]: value };
    setDraftData({ ...draftData, experience: updated });
  };

  const handleRemoveExperience = (index) => {
    setDraftData({ ...draftData, experience: (draftData.experience || []).filter((_, i) => i !== index) });
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = (draftData.projects || []).filter((_, i) => i !== index);
    setDraftData({ ...draftData, projects: updatedProjects });
  };

  const handleSectionChange = (section, field, value) => {
    setDraftData({
      ...draftData,
      sections: {
        ...(draftData.sections || {}),
        [section]: { ...(draftData.sections?.[section] || {}), [field]: value }
      }
    });
  };

  const uploadFileToServer = async (file, folder, customFilename = null) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file provided");
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result;
          const filename = customFilename || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, base64, folder })
          });
          const result = await response.json();
          if (result.success) resolve(result.url);
          else reject(result.error || "Upload failed");
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (index, file) => {
    try {
      setSaveMessage("Uploading image...");
      const url = await uploadFileToServer(file, 'projects');
      handleUpdateProject(index, 'image', url);
      setSaveMessage("Image uploaded successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage("Upload failed.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleProfileUpload = async (file, field, folder, strictBaseName = null) => {
    try {
      if (!file) return;
      setSaveMessage(`Uploading ${field}...`);

      let customFilename = null;
      if (strictBaseName) {
        const extension = file.name.split('.').pop();
        customFilename = `${strictBaseName}.${extension}`;
      }

      const url = await uploadFileToServer(file, folder, customFilename);
      // Add cache buster to ensure UI updates
      const timestampedUrl = `${url}?t=${Date.now()}`;
      setDraftData(prev => ({ ...prev, [field]: timestampedUrl }));
      setSaveMessage("File uploaded successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage("Upload failed.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleProfileFieldChange = (field, value) => {
    setDraftData({ ...draftData, [field]: value });
  };

  const handleContactChange = (field, value) => {
    setDraftData({
      ...draftData,
      contact: { ...(draftData.contact || {}), [field]: value }
    });
  };

  // Achievements handlers
  const handleAddAchievement = () => {
    const newAchievement = {
      title: "",
      description: "",
      prize: "",
      timestamp: Math.floor(Date.now() / 1000),
      _isEditable: true
    };
    setDraftData({ ...draftData, achievements: [newAchievement, ...(draftData.achievements || [])] });
  };

  const handleUpdateAchievement = (index, field, value) => {
    const updatedAchievements = [...(draftData.achievements || [])];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    setDraftData({ ...draftData, achievements: updatedAchievements });
  };

  const handleRemoveAchievement = (index) => {
    const updatedAchievements = (draftData.achievements || []).filter((_, i) => i !== index);
    setDraftData({ ...draftData, achievements: updatedAchievements });
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu = {
      school: "",
      degree: "",
      year: "",
      gpa: "",
      timestamp: Math.floor(Date.now() / 1000),
      _isEditable: true
    };
    setDraftData({ ...draftData, education: [newEdu, ...(draftData.education || [])] });
  };

  const handleUpdateEducation = (index, field, value) => {
    const updatedEdu = [...(draftData.education || [])];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setDraftData({ ...draftData, education: updatedEdu });
  };

  const handleRemoveEducation = (index) => {
    const updatedEdu = (draftData.education || []).filter((_, i) => i !== index);
    setDraftData({ ...draftData, education: updatedEdu });
  };

  // Certificates handlers
  const handleAddCertificate = () => {
    const newCert = {
      name: "",
      provider: "",
      description: "",
      date: "",
      timestamp: Math.floor(Date.now() / 1000),
      website: "",
      image: "",
      content: [],
      _isEditable: true
    };
    setDraftData({ ...draftData, certificates: [newCert, ...(draftData.certificates || [])] });
  };

  const handleUpdateCertificate = (index, field, value) => {
    const updatedCert = [...(draftData.certificates || [])];
    updatedCert[index] = { ...updatedCert[index], [field]: value };
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleRemoveCertificate = (index) => {
    const updatedCert = (draftData.certificates || []).filter((_, i) => i !== index);
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleUpdateCertContent = (certIdx, contentIdx, field, value) => {
    const updatedCert = [...(draftData.certificates || [])];
    const updatedContent = [...(updatedCert[certIdx]?.content || [])];
    updatedContent[contentIdx] = { ...updatedContent[contentIdx], [field]: value };
    updatedCert[certIdx] = { ...updatedCert[certIdx], content: updatedContent };
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleAddCertContent = (certIdx) => {
    const updatedCert = [...(draftData.certificates || [])];
    const newContentItem = { topic: "", description: "" };
    updatedCert[certIdx] = {
      ...updatedCert[certIdx],
      content: [...(updatedCert[certIdx]?.content || []), newContentItem]
    };
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleRemoveCertContent = (certIdx, contentIdx) => {
    const updatedContent = (updatedCert[certIdx]?.content || []).filter((_, i) => i !== contentIdx);
    updatedCert[certIdx] = { ...updatedCert[certIdx], content: updatedContent };
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleCertImageUpload = async (index, file) => {
    try {
      setSaveMessage("Uploading certificate image...");
      const url = await uploadFileToServer(file, 'assets/certificates');
      handleUpdateCertificate(index, 'image', url);
      setSaveMessage("Image uploaded successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage("Upload failed.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Download JSON fallback (for production/GitHub Pages)
  const handleDownloadJSON = () => {
    const payload = JSON.parse(JSON.stringify(draftData));
    const cleanPayload = (data) => {
      if (data.projects) data.projects = data.projects.map(({ _isEditable, ...rest }) => rest);
      if (data.achievements) data.achievements = data.achievements.map(({ _isEditable, ...rest }) => rest);
      if (data.education) data.education = data.education.map(({ _isEditable, ...rest }) => rest);
      if (data.certificates) data.certificates = data.certificates.map(({ _isEditable, ...rest }) => rest);
      return data;
    };
    
    const finalData = cleanPayload(payload);
    const fullData = { ...finalData, config: metadata.config || {} };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'metadata.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSaveMessage("File ready for download!");
    setTimeout(() => setSaveMessage(""), 4000);
  };

  // Save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage("");

    const payload = JSON.parse(JSON.stringify(draftData));
    if (payload.projects) {
      payload.projects = payload.projects.map(({ _isEditable, ...rest }) => rest);
    }
    if (payload.experience) {
      payload.experience = payload.experience.map(({ _isEditable, ...rest }) => rest);
    }
    if (payload.achievements) {
      payload.achievements = payload.achievements.map(({ _isEditable, ...rest }) => rest);
    }
    if (payload.education) {
      payload.education = payload.education.map(({ _isEditable, ...rest }) => rest);
    }
    if (payload.certificates) {
      payload.certificates = payload.certificates.map(({ _isEditable, ...rest }) => rest);
    }

    const finalPayload = { ...payload, config: metadata.config || {} };

    try {
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });
      const result = await response.json();
      if (result.success) {
        setSaveMessage("Changes successfully updated!");
        setRecentlyAdded([]);
        setEnableIdentityEdit(false);
        setEnableContactEdit(false);
        setEnableMediaEdit(false);
        setDraftData(prev => {
          const lockedDraft = { ...prev };
          if (lockedDraft.projects) lockedDraft.projects = lockedDraft.projects.map(p => ({ ...p, _isEditable: false }));
          if (lockedDraft.experience) lockedDraft.experience = lockedDraft.experience.map(e => ({ ...e, _isEditable: false }));
          if (lockedDraft.achievements) lockedDraft.achievements = lockedDraft.achievements.map(a => ({ ...a, _isEditable: false }));
          if (lockedDraft.education) lockedDraft.education = lockedDraft.education.map(e => ({ ...e, _isEditable: false }));
          if (lockedDraft.certificates) lockedDraft.certificates = lockedDraft.certificates.map(c => ({ ...c, _isEditable: false }));
          return lockedDraft;
        });
        setTimeout(() => setSaveMessage(""), 4000);
      } else {
        setSaveMessage("Failed to save changes.");
        setTimeout(() => setSaveMessage(""), 4000);
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Error connecting to server.");
      setTimeout(() => setSaveMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border/50 overflow-hidden text-left">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center p-6 border-b border-border/50 bg-card/50">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <AnimatePresence>
              {saveMessage && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                    (saveMessage.toLowerCase().includes("error") || 
                     saveMessage.toLowerCase().includes("fail") || 
                     saveMessage.toLowerCase().includes("invalid") || 
                     saveMessage.toLowerCase().includes("timeout"))
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : "bg-green-500/10 text-green-500 border border-green-500/20"
                  }`}
                >
                  {saveMessage}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {editMode !== null && (
              <motion.button 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onClick={() => { setEditMode(null); setAutoResumeFile(null); }}
                className="flex items-center gap-1.5 text-[#10b981] hover:text-[#10b981]/80 transition-colors w-fit"
              >
                <ArrowLeft size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Modes</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-4">
          {editMode === 'manual' && (
            <button
              onClick={isDevelopment ? handleSaveChanges : handleDownloadJSON}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold shadow-md transition-all"
              title={isDevelopment ? "Save Configuration" : "Download JSON"}
            >
              {isSaving ? "Saving..." : (
                isDevelopment ? <><Save size={16} /> Save JSON</> : <Download size={18} />
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close Dashboard"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {editMode === null && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-2 mb-10">
            <h3 className="text-3xl font-bold tracking-tight">Choose Edit Mode</h3>
            <p className="text-muted-foreground">How would you like to update your portfolio?</p>
          </div>
          <div className="w-full max-w-lg flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => setEditMode('manual')}
              className="flex-1 flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group shadow-sm hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Edit3 size={32} />
              </div>
              <span className="font-semibold text-lg">Manual Edit</span>
            </button>
            
            <button 
              onClick={() => setEditMode('auto')}
              className="flex-1 flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-border/50 hover:border-[#10b981]/50 hover:bg-[#10b981]/5 transition-all group shadow-sm hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] group-hover:scale-110 transition-transform">
                <Bot size={32} />
              </div>
              <span className="font-semibold text-lg whitespace-nowrap">Auto Update</span>
            </button>
          </div>
        </div>
      )}

      {editMode === 'auto' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-3xl mx-auto relative">
          {(!geminiKey && !onboardingCompleted) ? (
            <div className="w-full max-w-md relative">
              {/* Background Aura/Glow */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gradient-radial from-[#10b981]/15 via-transparent to-transparent -z-10 blur-3xl"
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-xl space-y-7 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Subtle top accent */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent" />
                
                {/* Improved Centerpiece */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] relative shadow-inner"
                >
                  <Bot size={32} />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-6px] border border-dashed border-[#10b981]/20 rounded-full"
                  />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase italic text-foreground leading-tight">
                    Gemini AI <span className="text-[#10b981]">Setup</span>
                  </h3>
                  <p className="text-muted-foreground text-[10px] font-medium leading-relaxed max-w-[200px] mx-auto opacity-70">
                    Connect your portfolio to Google Gemini for AI-powered updates.
                  </p>
                </div>

                <div className="w-full space-y-5">
                  <div className="space-y-2 text-left">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#10b981]/80 ml-1">Secure API Key</label>
                    <div className="relative group">
                      <input 
                        type={showGeminiKey ? "text" : "password"}
                        value={onboardingGeminiKey}
                        onChange={(e) => setOnboardingGeminiKey(e.target.value)}
                        placeholder="Paste your key here..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 transition-all font-mono shadow-sm text-center"
                      />
                      <button
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all active:scale-95"
                      >
                        {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={async () => {
                        setIsVerifying(true);
                        try {
                          const response = await fetch('/api/verify-gemini', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ geminiKey: onboardingGeminiKey })
                          });
                          const data = await response.json();
                          if (data.success) {
                            const saveRes = await fetch('/api/config', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ geminiKey: onboardingGeminiKey })
                            });
                            const saveData = await saveRes.json();
                            if (saveData.success) {
                              setGeminiKey(onboardingGeminiKey);
                              setOnboardingCompleted(true);
                              setSaveMessage("AI Connection established!");
                              // Refresh stats
                              const configRes = await fetch('/api/config');
                              const configData = await configRes.json();
                              if (configData.stats) setStats(configData.stats);
                            }
                          } else {
                            setSaveMessage("Invalid Credentials.");
                          }
                        } catch (err) {
                          setSaveMessage("Network Timeout.");
                        } finally {
                          setIsVerifying(false);
                          setTimeout(() => setSaveMessage(""), 3000);
                        }
                      }}
                      disabled={!onboardingGeminiKey || isVerifying || isUpdatingKey}
                      className="group relative w-full py-3 rounded-xl bg-[#10b981] text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40 transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isVerifying ? (
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        <span>{isVerifying ? "Verifying..." : "Establish Connection"}</span>
                      </div>
                    </button>
                    
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[9px] font-bold uppercase tracking-widest text-[#10b981] hover:underline flex items-center justify-center gap-1 opacity-80"
                    >
                      Retrieve API Key 
                      <ArrowLeft size={10} className="rotate-180" />
                    </a>
                  </div>
                </div>

                {saveMessage && saveMessage !== "Invalid Credentials." && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[9px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full border ${
                      (saveMessage.toLowerCase().includes("error") || 
                       saveMessage.toLowerCase().includes("fail") || 
                       saveMessage.toLowerCase().includes("invalid") || 
                       saveMessage.toLowerCase().includes("timeout"))
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20'
                    }`}
                  >
                    {saveMessage}
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="w-full max-w-md relative py-2 flex flex-col items-center">
              {/* Background Aura/Glow */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-full bg-gradient-radial from-[#10b981]/10 via-transparent to-transparent -z-10 blur-3xl pointer-events-none"
              />

              {/* Daily Usage Stats - Premium Display */}
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/40 backdrop-blur-md border border-[#10b981]/20 shadow-sm z-50">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">DAILY SYNCs:</span>
                <span className="text-[10px] font-black italic text-[#10b981]">{stats.dailyRequests || 0}</span>
              </div>

              <div className="flex flex-col items-center mb-6 space-y-3">
                <motion.div 
                   animate={{ y: [0, -4, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                   className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shadow-inner relative"
                >
                  <Bot size={24} />
                  <div className="absolute inset-0 border border-[#10b981]/10 rounded-xl animate-pulse" />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-xl font-black tracking-tight uppercase italic text-foreground leading-tight">AI Auto <span className="text-[#10b981]">Update</span></h3>
                  <p className="text-muted-foreground text-[9px] font-medium uppercase tracking-[0.2em] opacity-60 mt-0.5">Ready for Data Sync</p>
                </div>
              </div>

              {!autoResumeFile ? (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full relative group transition-all duration-500"
                >
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative bg-card/60 backdrop-blur-xl border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center transition-all ${
                      isDragging 
                        ? 'border-[#10b981] bg-[#10b981]/10 scale-[1.02] shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                        : 'border-border/60 hover:border-[#10b981]/40'
                    }`}
                  >
                    {/* Decorative Background Elements - pointer-events-none to prevent drag flicker */}
                    <div className="flex flex-col items-center pointer-events-none">
                      <motion.div 
                        animate={isDragging ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : { y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragging ? 'bg-[#10b981] text-white' : 'bg-[#10b981]/10 text-[#10b981] shadow-inner'}`}
                      >
                        <UploadCloud size={28} className="drop-shadow-lg" />
                      </motion.div>
                      
                      <div className="space-y-1 text-center mb-6">
                        <p className="text-lg font-black text-foreground uppercase tracking-tight italic">DRAG AND DROP</p>
                        <p className="text-[10px] text-muted-foreground font-black opacity-70 uppercase tracking-widest text-[#10b981]">STRICTLY ONLY PDF (5MB)</p>
                      </div>
                    </div>
                    
                    <label className="cursor-pointer relative z-10">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAutoResumeFile(e.target.files[0]);
                          }
                        }}
                      />
                      <span className="group relative flex items-center justify-center gap-3 px-8 py-3 rounded-xl bg-[#10b981] text-white font-[950] uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#10b981]/20 hover:scale-[1.05] active:scale-95 transition-all overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shiver_2s_infinite]" />
                        <Plus size={14} />
                        Browse File
                      </span>
                    </label>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full relative"
                >
                  <div className="relative bg-card/80 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-8 flex flex-col items-center shadow-2xl space-y-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/40 to-transparent" />
                    
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 text-[#10b981] flex items-center justify-center relative"
                    >
                      <FileText size={32} className="drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-6px] border border-dashed border-[#10b981]/20 rounded-full"
                      />
                    </motion.div>

                    <div className="text-center space-y-1.5">
                      <p className="text-base font-black text-foreground leading-tight px-4 truncate max-w-[280px]">{autoResumeFile.name}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                         {(autoResumeFile.size / (1024 * 1024)).toFixed(2)} MB • READY
                      </div>
                    </div>
                    
                    <div className="flex gap-3 w-full pt-2">
                      <button 
                        onClick={() => setAutoResumeFile(null)}
                        disabled={isProcessingAI}
                        className="flex-1 py-3.5 rounded-xl border border-border/50 hover:bg-muted text-muted-foreground font-black uppercase tracking-widest text-[9px] transition-all disabled:opacity-50"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={handleProcessWithAI}
                        disabled={isProcessingAI}
                        className="group relative flex-[2] py-3.5 rounded-xl bg-[#10b981] text-white font-black uppercase tracking-[0.15em] text-[9px] shadow-lg shadow-[#10b981]/20 overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shiver_2s_infinite]" />
                        <div className="relative flex items-center justify-center gap-2">
                          {isProcessingAI ? (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><CheckCircle2 size={14} /></motion.div>
                          )}
                          <span>{isProcessingAI ? "Syncing..." : "Process AI"}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          )}
        </div>
      )}

      {editMode === 'manual' && (
        <>
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border/50 bg-card p-2 gap-2">
        {['profile', 'skills', 'experience', 'projects', 'achievements', 'education', 'certificates', 'sections', 'config'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab === 'sections' ? 'Headers' : tab === 'config' ? 'Config' : tab}
          </button>
        ))}
        <div className="flex-1 px-4 flex items-center">
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        <AnimatePresence mode="wait">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="max-w-3xl space-y-6 pb-10">

              {/* Identity & Info */}
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableIdentityEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">Identity & Info</h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableIdentityEdit} onChange={(e) => setEnableIdentityEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                    <input type="text" disabled={!enableIdentityEdit} value={draftData.name || ""} onChange={(e) => handleProfileFieldChange('name', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <input type="text" disabled={!enableIdentityEdit} value={draftData.location || ""} onChange={(e) => handleProfileFieldChange('location', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Headline Title</label>
                    <input type="text" disabled={!enableIdentityEdit} value={draftData.title || ""} onChange={(e) => handleProfileFieldChange('title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Subtitle</label>
                    <input type="text" disabled={!enableIdentityEdit} value={draftData.subtitle || ""} onChange={(e) => handleProfileFieldChange('subtitle', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">About Summary</label>
                    <textarea disabled={!enableIdentityEdit} value={draftData.about || ""} onChange={(e) => handleProfileFieldChange('about', e.target.value)} rows="4" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Social & Contact Links */}
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableContactEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">Social & Contact Links</h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableContactEdit} onChange={(e) => setEnableContactEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                    <input type="email" disabled={!enableContactEdit} value={draftData.contact?.email || ""} onChange={(e) => handleContactChange('email', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">GitHub URL</label>
                    <input type="text" disabled={!enableContactEdit} value={draftData.contact?.github || ""} onChange={(e) => handleContactChange('github', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">LinkedIn URL</label>
                    <input type="text" disabled={!enableContactEdit} value={draftData.contact?.linkedin || ""} onChange={(e) => handleContactChange('linkedin', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Instagram URL</label>
                    <input type="text" disabled={!enableContactEdit} value={draftData.contact?.instagram || ""} onChange={(e) => handleContactChange('instagram', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">LeetCode URL</label>
                    <input type="text" disabled={!enableContactEdit} value={draftData.contact?.leetcode || ""} onChange={(e) => handleContactChange('leetcode', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Media Uploads */}
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableMediaEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">Media Links</h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableMediaEdit} onChange={(e) => setEnableMediaEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-6 mt-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2"><Image size={16} /> Profile Photo</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                        {draftData.profileImage ? (
                          <img src={getAssetUrl(draftData.profileImage)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex gap-2">
                          <input type="text" disabled={!enableMediaEdit} value={draftData.profileImage || ""} onChange={(e) => setDraftData({ ...draftData, profileImage: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                          <label className={`flex items-center justify-center px-3 border border-border rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors ${!enableMediaEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input type="file" disabled={!enableMediaEdit} accept="image/*" onChange={(e) => handleProfileUpload(e.target.files[0], 'profileImage', 'assets', 'profile-pic')} className="hidden" />
                            <Image size={16} />
                          </label>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">Current path: {draftData.profileImage || "No image set"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2"><FileText size={16} /> Resume File</h3>
                    <div className="flex gap-2">
                      <input type="text" disabled={!enableMediaEdit} value={draftData.resume || ""} onChange={handleResumeChange} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      <label className={`flex items-center justify-center px-3 border border-border rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors ${!enableMediaEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" disabled={!enableMediaEdit} accept="application/pdf" onChange={(e) => handleProfileUpload(e.target.files[0], 'resume', 'assets/resume', 'HariharanSD')} className="hidden" />
                        <FileText size={16} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <motion.div key="skills" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Tag size={20} className="text-primary" /> Manage Skills
                <span className="text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 ml-2">
                  {(draftData.skills || []).length}
                </span>
              </h3>
              <div className="flex gap-4 max-w-xl">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Type a skill..."
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button onClick={handleAddSkill} className="flex items-center justify-center gap-2 px-6 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                  <Plus size={18} /> Add
                </button>
              </div>
              {recentlyAdded.length > 0 && (
                <div className="mt-8 space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <h4 className="text-sm font-semibold text-primary flex items-center gap-2">Recently Added</h4>
                  <div className="flex flex-wrap gap-2">
                    {recentlyAdded.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/50 text-primary text-sm font-medium">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="hover:text-primary-foreground transition-colors"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-6">
                {(draftData.skills || []).filter(s => !recentlyAdded.includes(s)).map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-sm">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-destructive transition-colors"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Link size={20} className="text-primary" /> Manage Projects
                  <span className="text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 ml-2">
                    {(draftData.projects || []).length}
                  </span>
                </h3>
                <button onClick={handleAddProject} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  <Plus size={18} /> New Project
                </button>
              </div>
              <div className="grid gap-6 mt-4">
                {(draftData.projects || []).map((proj, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!proj._isEditable ? 'opacity-70' : ''}`}>
                    <div className="absolute top-4 right-4 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                        <input
                          type="checkbox"
                          checked={!!proj._isEditable}
                          onChange={(e) => handleUpdateProject(idx, '_isEditable', e.target.checked)}
                          className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer"
                        />
                        Enable Edit
                      </label>
                      <button
                        onClick={() => handleRemoveProject(idx)}
                        disabled={!proj._isEditable}
                        className={`transition-colors ${proj._isEditable ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground/30 cursor-not-allowed'}`}
                        title={!proj._isEditable ? "Enable editing to delete" : "Delete Project"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Title</label>
                        <input type="text" disabled={!proj._isEditable} value={proj.title} onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Category</label>
                        <input type="text" disabled={!proj._isEditable} value={proj.category} onChange={(e) => handleUpdateProject(idx, 'category', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <textarea disabled={!proj._isEditable} value={proj.description} onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)} rows="3" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Live Link</label>
                        <input type="text" disabled={!proj._isEditable} value={proj.liveLink} onChange={(e) => handleUpdateProject(idx, 'liveLink', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Code Link</label>
                        <input type="text" disabled={!proj._isEditable} value={proj.codeLink} onChange={(e) => handleUpdateProject(idx, 'codeLink', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Image Path</label>
                        <div className="flex gap-2">
                          <input type="text" disabled={!proj._isEditable} value={proj.image} onChange={(e) => handleUpdateProject(idx, 'image', e.target.value)} placeholder="/projects/..." className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                          <label className={`flex items-center justify-center px-3 border border-border rounded-md bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors ${!proj._isEditable ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(idx, e.target.files[0])} className="hidden" />
                            <Image size={16} />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Timestamp (Epoch)</label>
                        <input
                          type="number"
                          disabled={!proj._isEditable}
                          value={proj.timestamp}
                          onChange={(e) => handleUpdateProject(idx, 'timestamp', parseInt(e.target.value) || 0)}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Comma-separated Tech Stack</label>
                        <input
                          type="text"
                          disabled={!proj._isEditable}
                          value={proj.tech.join(", ")}
                          onChange={(e) => handleUpdateProject(idx, 'tech', e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="flex items-center gap-6 mt-2 md:col-span-2">
                        <label className={`flex items-center gap-2 cursor-pointer text-sm font-medium select-none ${!proj._isEditable ? 'opacity-50 text-muted-foreground' : 'text-foreground'}`}>
                          <input
                            type="checkbox"
                            disabled={!proj._isEditable}
                            checked={proj.isClickable}
                            onChange={(e) => handleUpdateProject(idx, 'isClickable', e.target.checked)}
                            className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer disabled:cursor-not-allowed"
                          />
                          Active Live Link
                        </label>
                        <label className={`flex items-center gap-2 cursor-pointer text-sm font-medium select-none ${!proj._isEditable ? 'opacity-50 text-muted-foreground' : 'text-foreground'}`}>
                          <input
                            type="checkbox"
                            disabled={!proj._isEditable}
                            checked={proj.isCodeClickable}
                            onChange={(e) => handleUpdateProject(idx, 'isCodeClickable', e.target.checked)}
                            className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer disabled:cursor-not-allowed"
                          />
                          Active Code Link
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <motion.div key="experience" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase size={20} className="text-primary" /> Manage Experience
                  <span className="text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 ml-2">
                    {(draftData.experience || []).length}
                  </span>
                </h3>
                <button onClick={handleAddExperience} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  <Plus size={18} /> New Experience
                </button>
              </div>
              <div className="grid gap-6 mt-4">
                {(draftData.experience || []).map((exp, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!exp._isEditable ? 'opacity-70' : ''}`}>
                    <div className="absolute top-4 right-4 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                        <input
                          type="checkbox"
                          checked={!!exp._isEditable}
                          onChange={(e) => handleUpdateExperience(idx, '_isEditable', e.target.checked)}
                          className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer"
                        />
                        Enable Edit
                      </label>
                      <button
                        onClick={() => handleRemoveExperience(idx)}
                        disabled={!exp._isEditable}
                        className={`transition-colors ${exp._isEditable ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground/30 cursor-not-allowed'}`}
                        title={!exp._isEditable ? "Enable editing to delete" : "Delete Experience"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Company</label>
                        <input type="text" disabled={!exp._isEditable} value={exp.company} onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Role / Position</label>
                        <input type="text" disabled={!exp._isEditable} value={exp.role} onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Duration (e.g. 2021 - Present)</label>
                        <input type="text" disabled={!exp._isEditable} value={exp.duration} onChange={(e) => handleUpdateExperience(idx, 'duration', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Timestamp (Epoch Sorting)</label>
                        <input
                          type="number"
                          disabled={!exp._isEditable}
                          value={exp.timestamp || 0}
                          onChange={(e) => handleUpdateExperience(idx, 'timestamp', parseInt(e.target.value) || 0)}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <textarea disabled={!exp._isEditable} value={exp.description} onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)} rows="3" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar size={20} className="text-primary" /> Manage Achievements
                  <span className="text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 ml-2">
                    {(draftData.achievements || []).length}
                  </span>
                </h3>
                <button onClick={handleAddAchievement} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  <Plus size={18} /> New Achievement
                </button>
              </div>
              <div className="grid gap-6 mt-4">
                {(draftData.achievements || []).map((ach, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!ach._isEditable ? 'opacity-70' : ''}`}>
                    <div className="absolute top-4 right-4 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                        <input
                          type="checkbox"
                          checked={!!ach._isEditable}
                          onChange={(e) => handleUpdateAchievement(idx, '_isEditable', e.target.checked)}
                          className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer"
                        />
                        Enable Edit
                      </label>
                      <button
                        onClick={() => handleRemoveAchievement(idx)}
                        disabled={!ach._isEditable}
                        className={`transition-colors ${ach._isEditable ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground/30 cursor-not-allowed'}`}
                        title={!ach._isEditable ? "Enable editing to delete" : "Delete Achievement"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Title</label>
                        <input type="text" disabled={!ach._isEditable} value={ach.title} onChange={(e) => handleUpdateAchievement(idx, 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Prize / Role</label>
                        <input type="text" disabled={!ach._isEditable} value={ach.prize} onChange={(e) => handleUpdateAchievement(idx, 'prize', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Timestamp (Epoch)</label>
                        <input
                          type="number"
                          disabled={!ach._isEditable}
                          value={ach.timestamp || 0}
                          onChange={(e) => handleUpdateAchievement(idx, 'timestamp', parseInt(e.target.value) || 0)}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <textarea disabled={!ach._isEditable} value={ach.description} onChange={(e) => handleUpdateAchievement(idx, 'description', e.target.value)} rows="3" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <motion.div key="education" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <GraduationCap size={20} className="text-primary" /> Manage Education
                  <span className="text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 ml-2">
                    {draftData.education?.length || 0}
                  </span>
                </h3>
                <button onClick={handleAddEducation} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  <Plus size={18} /> New Education
                </button>
              </div>
              <div className="grid gap-6 mt-4">
                {draftData.education?.map((edu, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!edu._isEditable ? 'opacity-70' : ''}`}>
                    <div className="absolute top-4 right-4 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                        <input
                          type="checkbox"
                          checked={!!edu._isEditable}
                          onChange={(e) => handleUpdateEducation(idx, '_isEditable', e.target.checked)}
                          className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer"
                        />
                        Enable Edit
                      </label>
                      <button
                        onClick={() => handleRemoveEducation(idx)}
                        disabled={!edu._isEditable}
                        className={`transition-colors ${edu._isEditable ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground/30 cursor-not-allowed'}`}
                        title={!edu._isEditable ? "Enable editing to delete" : "Delete Education"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">School</label>
                        <input type="text" disabled={!edu._isEditable} value={edu.school} onChange={(e) => handleUpdateEducation(idx, 'school', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Degree</label>
                        <input type="text" disabled={!edu._isEditable} value={edu.degree} onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Year Range</label>
                        <input type="text" disabled={!edu._isEditable} value={edu.year} onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">GPA / %</label>
                        <input type="text" disabled={!edu._isEditable} value={edu.gpa} onChange={(e) => handleUpdateEducation(idx, 'gpa', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Timestamp (Epoch)</label>
                        <input
                          type="number"
                          disabled={!edu._isEditable}
                          value={edu.timestamp || 0}
                          onChange={(e) => handleUpdateEducation(idx, 'timestamp', parseInt(e.target.value) || 0)}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <motion.div key="certificates" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Award size={20} className="text-primary" /> Manage Certificates
                  <span className="text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 ml-2">
                    {draftData.certificates?.length || 0}
                  </span>
                </h3>
                <button onClick={handleAddCertificate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  <Plus size={18} /> New Certificate
                </button>
              </div>
              <div className="grid gap-6 mt-4">
                {draftData.certificates?.map((cert, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!cert._isEditable ? 'opacity-70' : ''}`}>
                    <div className="absolute top-4 right-4 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                        <input
                          type="checkbox"
                          checked={!!cert._isEditable}
                          onChange={(e) => handleUpdateCertificate(idx, '_isEditable', e.target.checked)}
                          className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer"
                        />
                        Enable Edit
                      </label>
                      <button
                        onClick={() => handleRemoveCertificate(idx)}
                        disabled={!cert._isEditable}
                        className={`transition-colors ${cert._isEditable ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground/30 cursor-not-allowed'}`}
                        title={!cert._isEditable ? "Enable editing to delete" : "Delete Certificate"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Certificate Name</label>
                        <input type="text" disabled={!cert._isEditable} value={cert.name} onChange={(e) => handleUpdateCertificate(idx, 'name', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Provider</label>
                        <input type="text" disabled={!cert._isEditable} value={cert.provider} onChange={(e) => handleUpdateCertificate(idx, 'provider', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Certified Date</label>
                        <input
                          type="text"
                          disabled={!cert._isEditable}
                          placeholder="March 8, 2026"
                          value={cert.date}
                          onChange={(e) => handleUpdateCertificate(idx, 'date', e.target.value)}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Website URL</label>
                        <input type="text" disabled={!cert._isEditable} value={cert.website} onChange={(e) => handleUpdateCertificate(idx, 'website', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Image Path</label>
                        <div className="flex gap-2">
                          <input type="text" disabled={!cert._isEditable} value={cert.image} onChange={(e) => handleUpdateCertificate(idx, 'image', e.target.value)} placeholder="/assets/..." className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                          <label className={`flex items-center justify-center px-3 border border-border rounded-md bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors ${!cert._isEditable ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input type="file" accept="image/*" onChange={(e) => handleCertImageUpload(idx, e.target.files[0])} className="hidden" />
                            <Image size={16} />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Timestamp (Epoch)</label>
                        <input
                          type="number"
                          disabled={!cert._isEditable}
                          value={cert.timestamp || 0}
                          onChange={(e) => handleUpdateCertificate(idx, 'timestamp', parseInt(e.target.value) || 0)}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <textarea
                          disabled={!cert._isEditable}
                          value={cert.description || ""}
                          onChange={(e) => handleUpdateCertificate(idx, 'description', e.target.value)}
                          rows="3"
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Nested Content Items */}
                      <div className="md:col-span-2 mt-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-border/30 pb-2">
                          <h4 className="text-sm font-semibold text-muted-foreground">Course Content / Topics</h4>
                          <button
                            onClick={() => handleAddCertContent(idx)}
                            disabled={!cert._isEditable}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                          >
                            + Add Topic
                          </button>
                        </div>
                        <div className="space-y-4">
                          {cert.content?.map((item, cIdx) => (
                            <div key={cIdx} className="p-4 bg-background border border-border rounded-xl relative">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1 space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Topic Name</label>
                                  <textarea
                                    placeholder="Enter topic name..."
                                    disabled={!cert._isEditable}
                                    value={item.topic}
                                    onChange={(e) => handleUpdateCertContent(idx, cIdx, 'topic', e.target.value)}
                                    rows="1"
                                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                </div>
                                <button
                                  onClick={() => handleRemoveCertContent(idx, cIdx)}
                                  disabled={!cert._isEditable}
                                  className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${!cert._isEditable ? 'hidden' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-sm hover:shadow-red-500/30'}`}
                                  title="Remove Topic"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Topic Description</label>
                                <textarea
                                  placeholder="Describe what you learned in this topic..."
                                  disabled={!cert._isEditable}
                                  value={item.description}
                                  onChange={(e) => handleUpdateCertContent(idx, cIdx, 'description', e.target.value)}
                                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                                  rows="3"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Page Headers Tab */}
          {activeTab === 'sections' && (
            <motion.div key="sections" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="max-w-3xl space-y-6 pb-10">
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableSectionsEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <Layout size={20} /> Headers & Subtitles
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableSectionsEdit} onChange={(e) => setEnableSectionsEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>

                <div className="space-y-8 mt-6">
                  {/* About Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">About Section</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Main Title</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.about?.title || ""} onChange={(e) => handleSectionChange('about', 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">Hero Section</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Greeting Prefix (e.g. "Hi, I'm")</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.hero?.greeting || ""} onChange={(e) => handleSectionChange('hero', 'greeting', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">Experience Section</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.experience?.title || ""} onChange={(e) => handleSectionChange('experience', 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Achievements Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">Achievements Section</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.achievements?.title || ""} onChange={(e) => handleSectionChange('achievements', 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">Education Section</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.education?.title || ""} onChange={(e) => handleSectionChange('education', 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">Projects Section</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.projects?.title || ""} onChange={(e) => handleSectionChange('projects', 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Subtitle / Intro</label>
                        <textarea disabled={!enableSectionsEdit} value={draftData.sections?.projects?.subtitle || ""} onChange={(e) => handleSectionChange('projects', 'subtitle', e.target.value)} rows="2" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Certificates Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">Certificates Section</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.certificates?.title || ""} onChange={(e) => handleSectionChange('certificates', 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Subtitle / Intro</label>
                        <textarea disabled={!enableSectionsEdit} value={draftData.sections?.certificates?.subtitle || ""} onChange={(e) => handleSectionChange('certificates', 'subtitle', e.target.value)} rows="2" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">Contact Section</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.contact?.title || ""} onChange={(e) => handleSectionChange('contact', 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Subtitle / Intro</label>
                        <textarea disabled={!enableSectionsEdit} value={draftData.sections?.contact?.subtitle || ""} onChange={(e) => handleSectionChange('contact', 'subtitle', e.target.value)} rows="2" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">Skills Section (Arsenal)</h4>
                    <div className="grid grid-cols-1 gap-4 ml-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                        <input type="text" disabled={!enableSectionsEdit} value={draftData.sections?.skills?.title || ""} onChange={(e) => handleSectionChange('skills', 'title', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Subtitle / Intro</label>
                        <textarea disabled={!enableSectionsEdit} value={draftData.sections?.skills?.subtitle || ""} onChange={(e) => handleSectionChange('skills', 'subtitle', e.target.value)} rows="2" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Config Tab */}
          {activeTab === 'config' && (
            <motion.div key="config" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="max-w-3xl space-y-6 pb-10">
              
              {/* Visual Appearance Section */}
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableThemeEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <Sun size={20} className="dark:hidden" />
                    <Moon size={20} className="hidden dark:block" />
                    Visual Appearance
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableThemeEdit} onChange={(e) => setEnableThemeEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>
                
                <p className="text-xs text-muted-foreground italic -mt-2">
                  Customize your workspace aesthetic. This affects the look and feel of your dashboard.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                   <button
                     onClick={() => handleUpdateTheme('light')}
                     disabled={!enableThemeEdit}
                     className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${!enableThemeEdit ? 'cursor-not-allowed opacity-50' : ''} ${theme === 'light' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border/50 hover:border-border hover:bg-muted/50'}`}
                   >
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Sun size={24} />
                     </div>
                     <div className="text-center">
                        <p className="font-bold text-sm">Light Mode</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Classic Clarity</p>
                     </div>
                   </button>

                   <button
                     onClick={() => handleUpdateTheme('dark')}
                     disabled={!enableThemeEdit}
                     className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${!enableThemeEdit ? 'cursor-not-allowed opacity-50' : ''} ${theme === 'dark' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border/50 hover:border-border hover:bg-muted/50'}`}
                   >
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Moon size={24} />
                     </div>
                     <div className="text-center">
                        <p className="font-bold text-sm">Dark Mode</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Midnight Premium</p>
                     </div>
                   </button>
                </div>
              </div>

              {/* GitHub Deployment Section */}
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableGithubEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <UploadCloud size={20} /> GitHub Deployment Service
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableGithubEdit} onChange={(e) => setEnableGithubEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>

                <p className="text-xs text-muted-foreground italic -mt-2">
                  Sync your local portfolio changes directly to your GitHub repository and trigger a deployment.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">GitHub Repository Path</label>
                      <input 
                        type="text" 
                        disabled={!enableGithubEdit}
                        value={githubRepo} 
                        onChange={(e) => setGithubRepo(e.target.value)} 
                        placeholder="username/repository"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Target Branch</label>
                      <input 
                        type="text" 
                        disabled={!enableGithubEdit}
                        value={githubBranch} 
                        onChange={(e) => setGithubBranch(e.target.value)} 
                        placeholder="main"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                       <div className="flex items-center gap-1.5">
                          <span>GITHUB PERSONAL ACCESS TOKEN</span>
                          <button 
                            onClick={() => setShowTokenHelp(!showTokenHelp)}
                            className="p-1 rounded-full hover:bg-muted text-primary transition-colors"
                            title="How to get this token?"
                          >
                             <HelpCircle size={14} />
                          </button>
                       </div>
                       <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Requires 'repo' scope</span>
                    </label>

                    <AnimatePresence>
                      {showTokenHelp && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl mb-3 space-y-4 shadow-inner">
                            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                              <HelpCircle size={16} /> Extended Guide: Generating your Token
                            </h4>
                            <div className="space-y-4 text-[11px] leading-relaxed">
                              <div>
                                <p className="font-bold text-primary flex items-center gap-1.5 mb-1">
                                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">1</span>
                                  Open GitHub Settings:
                                </p>
                                <p className="pl-5 text-muted-foreground">Log in to GitHub and click your <b>Profile Picture</b> in the top-right corner. Select <b>Settings</b> from the menu.</p>
                              </div>

                              <div>
                                <p className="font-bold text-primary flex items-center gap-1.5 mb-1">
                                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">2</span>
                                  Go to Developer Settings:
                                </p>
                                <p className="pl-5 text-muted-foreground">Scroll all the way to the bottom of the left-hand menu. Click <b>Developer settings</b>.</p>
                              </div>

                              <div>
                                <p className="font-bold text-primary flex items-center gap-1.5 mb-1">
                                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">3</span>
                                  Choose Tokens (Classic):
                                </p>
                                <p className="pl-5 text-muted-foreground">On the left, click <b>Personal access tokens</b> &rarr; <b>Tokens (classic)</b>.</p>
                              </div>

                              <div>
                                <p className="font-bold text-primary flex items-center gap-1.5 mb-1">
                                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">4</span>
                                  Generate a New Token:
                                </p>
                                <p className="pl-5 text-muted-foreground">Click <b>Generate new token</b> button (top-right) &rarr; <b>Generate new token (classic)</b>.</p>
                                <div className="ml-5 mt-2 bg-background/50 p-2 rounded border border-border/50">
                                   <p><b>Note:</b> Type <code className="text-primary px-1">Portfolio-Key</code> so you remember it.</p>
                                   <p><b>Expiration:</b> Set to <b>"No expiration"</b> for convenience.</p>
                                </div>
                              </div>

                              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 animate-pulse-slow">
                                <p className="font-bold text-primary flex items-center gap-1.5 mb-1">
                                  <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-[10px]">5</span>
                                  Select Scopes (CRITICAL):
                                </p>
                                <p className="pl-5 text-primary">Check the box that says <b>repo</b>. This gives the dashboard permission to sync your files!</p>
                              </div>

                              <div>
                                <p className="font-bold text-primary flex items-center gap-1.5 mb-1">
                                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">6</span>
                                  Create and Copy:
                                </p>
                                <p className="pl-5 text-muted-foreground flex flex-col gap-1">
                                   <span>Scroll to the bottom and click <b>Generate token</b>.</span>
                                   <span className="font-bold text-red-500 uppercase tracking-tighter">Copy the code immediately (ghp_...)! GitHub will hide it after you refresh.</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative group">
                      <input
                        type={showGithubToken ? "text" : "password"}
                        disabled={!enableGithubEdit}
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="ghp_..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono disabled:opacity-50"
                      />
                      <button
                        onClick={() => setShowGithubToken(!showGithubToken)}
                        disabled={!enableGithubEdit}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
                      >
                        {showGithubToken ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateGithubConfig}
                        disabled={isUpdatingGithub || !enableGithubEdit || !githubToken}
                        className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-muted/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isUpdatingGithub ? "Saving..." : <><Save size={18} /> Save Settings</>}
                      </button>
                      
                      <button
                        onClick={handleSyncToGitHub}
                        disabled={isSyncingGithub || isUpdatingGithub || !githubToken || !githubRepo}
                        className="flex-[2] py-3 rounded-xl bg-[#10b981] text-white font-bold hover:bg-[#10b981]/90 transition-all shadow-lg shadow-[#10b981]/25 disabled:opacity-50 flex items-center justify-center gap-2 group overflow-hidden relative"
                      >
                        {isSyncingGithub && (
                          <motion.div 
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          />
                        )}
                        <UploadCloud size={18} />
                        {isSyncingGithub ? "Deploying..." : "Sync to GitHub"}
                      </button>
                    </div>

                    {syncStatus.text && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between ${
                          syncStatus.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                          syncStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          'bg-primary/5 text-primary border border-primary/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {syncStatus.type === 'loading' && <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                          {syncStatus.text}
                        </div>
                        {syncStatus.url && (
                          <a href={syncStatus.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline hover:text-green-600 transition-colors">
                            View Commit <ExternalLink size={12} />
                          </a>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gemini AI Config Section */}
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableGeminiEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <Bot size={20} /> Gemini AI Configuration
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableGeminiEdit} onChange={(e) => setEnableGeminiEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>
                
                <p className="text-xs text-muted-foreground italic -mt-2">
                  This key is used for parsing resumes with the "Process with AI" feature.
                </p>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      GEMINI API KEY
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-normal">Stored in metadata.json</span>
                    </label>
                    <div className="relative group">
                      <input
                        type={showGeminiKey ? "text" : "password"}
                        disabled={!enableGeminiEdit}
                        value={geminiKey}
                        onChange={(e) => {
                          setGeminiKey(e.target.value);
                          setIsKeyVerified(false);
                        }}
                        placeholder="AIzaSy..."
                        className={`w-full bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed ${
                          isKeyVerified ? 'border-green-500/50 focus:ring-green-500/20' : 'border-border focus:ring-primary/20'
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {isKeyVerified && <CheckCircle2 size={18} className="text-green-500" />}
                        <button
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          disabled={!enableGeminiEdit}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
                        >
                          {showGeminiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground italic">
                        This key is used for parsing resumes with the "Process with AI" feature.
                      </p>
                      {enableGeminiEdit && !isKeyVerified && geminiKey && (
                        <button
                          onClick={handleVerifyKey}
                          disabled={isVerifying}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          {isVerifying ? "Verifying..." : "Click to Verify Key"}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleUpdateGeminiConfig}
                    disabled={isUpdatingKey || !enableGeminiEdit || !isKeyVerified}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdatingKey ? (
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {!isKeyVerified ? "Verify Key First" : (isUpdatingKey ? "Updating..." : "Update API Key")}
                  </button>
                </div>
              </div>

              {/* Dashboard Security Section */}
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableAdminAccessEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <Lock size={20} /> Dashboard Security
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableAdminAccessEdit} onChange={(e) => setEnableAdminAccessEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                       <span className="flex items-center gap-2">
                         Admin Access Key
                         <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-normal">Stored in metadata.json</span>
                       </span>
                       <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Hashed for Security</span>
                    </label>
                    <div className="relative group">
                      <input
                        type={showAdminAccessKey ? "text" : "password"}
                        disabled={!enableAdminAccessEdit}
                        value={adminAccessKey}
                        onChange={(e) => setAdminAccessKey(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        onClick={() => setShowAdminAccessKey(!showAdminAccessKey)}
                        disabled={!enableAdminAccessEdit}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
                      >
                        {showAdminAccessKey ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      This is the password you use to enter this Admin Panel from the footer.
                    </p>
                  </div>

                  <button
                    onClick={handleUpdateAccessKey}
                    disabled={isUpdatingAccessKey || !enableAdminAccessEdit || !adminAccessKey}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdatingAccessKey ? (
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {isUpdatingAccessKey ? "Updating..." : "Update Access Key"}
                  </button>
                </div>
              </div>

              {/* Section Visibility Section */}
              <div className={`p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-4 relative transition-opacity ${!enableVisibilityEdit ? 'opacity-80' : ''}`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <Settings size={20} /> Section Visibility
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground select-none">
                    <input type="checkbox" checked={enableVisibilityEdit} onChange={(e) => setEnableVisibilityEdit(e.target.checked)} className="rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer" />
                    Enable Edit
                  </label>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                  Toggle which sections are visible on your public portfolio. Hidden sections still keep their data safely saved.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'about', label: 'About Me / Profile' },
                    { id: 'experience', label: 'Work Experience' },
                    { id: 'achievements', label: 'Achievements' },
                    { id: 'projects', label: 'Featured Projects' },
                    { id: 'certificates', label: 'Certificates' },
                    { id: 'skills', label: 'Technical Arsenal (Skills)' },
                    { id: 'education', label: 'Education' },
                    { id: 'contact', label: 'Contact Section' }
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      disabled={!enableVisibilityEdit}
                      onClick={() => handleSectionChange(sec.id, 'show', !draftData.sections[sec.id]?.show)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        draftData.sections[sec.id]?.show 
                        ? (enableVisibilityEdit ? 'bg-[#10b981]/5 border-[#10b981]/20 hover:bg-[#10b981]/10' : 'bg-card border-border opacity-80') 
                        : 'bg-muted/30 border-border hover:bg-muted/50 opacity-60'
                      } ${!enableVisibilityEdit ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          draftData.sections[sec.id]?.show 
                          ? (enableVisibilityEdit ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-muted text-muted-foreground') 
                          : 'bg-muted text-muted-foreground'
                        }`}>
                          {draftData.sections[sec.id]?.show ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                        <span className="font-medium text-sm">{sec.label}</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                        draftData.sections[sec.id]?.show 
                        ? (enableVisibilityEdit ? 'bg-[#10b981]' : 'bg-muted-foreground/40') 
                        : 'bg-muted-foreground/20'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${draftData.sections[sec.id]?.show ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
        </>
      )}
      {/* Dashboard Footer Status Bar */}
      {editMode !== null && (
        <div className="px-6 py-2 border-t border-border/50 bg-card/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Dynamic Status Dot */}
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--status-color),0.5)] ${
                calculateHealth() < 60 ? 'bg-red-500' : 
                calculateHealth() < 90 ? 'bg-yellow-500' : 'bg-[#10b981]'
              }`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Portfolio Integrity Status</span>
            </div>
            
            <div className="h-4 w-[1px] bg-border/50" />
            
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-muted/30 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${calculateHealth()}%`,
                    backgroundColor: calculateHealth() < 60 ? '#ef4444' : calculateHealth() < 90 ? '#f59e0b' : '#10b981'
                  }}
                  className="h-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                />
              </div>
              <span className={`text-[10px] font-black italic whitespace-nowrap uppercase tracking-tighter transition-colors duration-500 ${
                calculateHealth() < 60 ? 'text-red-500' : 
                calculateHealth() < 90 ? 'text-yellow-500' : 'text-[#10b981]'
              }`}>
                {calculateHealth()}% Healthy
              </span>
            </div>
          </div>
          <div className="text-[8px] font-medium text-muted-foreground/60 uppercase tracking-widest">
            System Synchronized • Last checked just now
          </div>
        </div>
      )}
    </div>
  );
}
