import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, X, Link, Image, Calendar, Tag, FileText, GraduationCap, Award, Layout, Download } from 'lucide-react';
import metadata from '../data/metadata.json';

export default function AdminPanel({ onClose }) {
  const isDevelopment = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
  const [activeTab, setActiveTab] = useState('profile');
  const [draftData, setDraftData] = useState(JSON.parse(JSON.stringify(metadata)));
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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

    setDraftData({ ...draftData, skills: [...draftData.skills, trimmedSkill] });
    setRecentlyAdded([...recentlyAdded, trimmedSkill]);
    setNewSkill("");
    setSaveMessage(`Skill added successfully!`);
    setTimeout(() => setSaveMessage(""), 3000);
  };
  const handleRemoveSkill = (skillToRemove) => {
    setDraftData({ ...draftData, skills: draftData.skills.filter(s => s !== skillToRemove) });
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
    setDraftData({ ...draftData, projects: [newProject, ...draftData.projects] });
  };

  const handleUpdateProject = (index, field, value) => {
    const updatedProjects = [...draftData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setDraftData({ ...draftData, projects: updatedProjects });
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = draftData.projects.filter((_, i) => i !== index);
    setDraftData({ ...draftData, projects: updatedProjects });
  };

  const handleSectionChange = (section, field, value) => {
    setDraftData({
      ...draftData,
      sections: {
        ...draftData.sections,
        [section]: { ...draftData.sections[section], [field]: value }
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
      contact: { ...draftData.contact, [field]: value }
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
    setDraftData({ ...draftData, achievements: [newAchievement, ...draftData.achievements] });
  };

  const handleUpdateAchievement = (index, field, value) => {
    const updatedAchievements = [...draftData.achievements];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    setDraftData({ ...draftData, achievements: updatedAchievements });
  };

  const handleRemoveAchievement = (index) => {
    const updatedAchievements = draftData.achievements.filter((_, i) => i !== index);
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
    setDraftData({ ...draftData, education: [newEdu, ...draftData.education] });
  };

  const handleUpdateEducation = (index, field, value) => {
    const updatedEdu = [...draftData.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setDraftData({ ...draftData, education: updatedEdu });
  };

  const handleRemoveEducation = (index) => {
    const updatedEdu = draftData.education.filter((_, i) => i !== index);
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
    setDraftData({ ...draftData, certificates: [newCert, ...draftData.certificates] });
  };

  const handleUpdateCertificate = (index, field, value) => {
    const updatedCert = [...draftData.certificates];
    updatedCert[index] = { ...updatedCert[index], [field]: value };
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleRemoveCertificate = (index) => {
    const updatedCert = draftData.certificates.filter((_, i) => i !== index);
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleUpdateCertContent = (certIdx, contentIdx, field, value) => {
    const updatedCert = [...draftData.certificates];
    const updatedContent = [...updatedCert[certIdx].content];
    updatedContent[contentIdx] = { ...updatedContent[contentIdx], [field]: value };
    updatedCert[certIdx] = { ...updatedCert[certIdx], content: updatedContent };
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleAddCertContent = (certIdx) => {
    const updatedCert = [...draftData.certificates];
    const newContentItem = { topic: "", description: "" };
    updatedCert[certIdx] = {
      ...updatedCert[certIdx],
      content: [...updatedCert[certIdx].content, newContentItem]
    };
    setDraftData({ ...draftData, certificates: updatedCert });
  };

  const handleRemoveCertContent = (certIdx, contentIdx) => {
    const updatedCert = [...draftData.certificates];
    const updatedContent = updatedCert[certIdx].content.filter((_, i) => i !== contentIdx);
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
    const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: 'application/json' });
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
    if (payload.achievements) {
      payload.achievements = payload.achievements.map(({ _isEditable, ...rest }) => rest);
    }
    if (payload.education) {
      payload.education = payload.education.map(({ _isEditable, ...rest }) => rest);
    }
    if (payload.certificates) {
      payload.certificates = payload.certificates.map(({ _isEditable, ...rest }) => rest);
    }

    try {
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <AnimatePresence>
            {saveMessage && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${saveMessage.includes("success")
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
              >
                {saveMessage}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          >
            Lock Session
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close Dashboard"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border/50 bg-card p-2 gap-2">
        {['profile', 'skills', 'projects', 'achievements', 'education', 'certificates', 'sections'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab === 'sections' ? 'Page Headers' : tab}
          </button>
        ))}
        <div className="flex-1 px-4 flex items-center">
        </div>

        <button
          onClick={isDevelopment ? handleSaveChanges : handleDownloadJSON}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-sm font-medium transition-all"
          title={isDevelopment ? "Save JSON" : "Download JSON"}
        >
          {isSaving ? "Saving..." : (
            isDevelopment ? <><Save size={16} /> Save JSON</> : <Download size={18} />
          )}
        </button>
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
                    <div className="flex gap-2">
                      <input type="text" disabled={!enableMediaEdit} value={draftData.profileImage || ""} onChange={(e) => setDraftData({ ...draftData, profileImage: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed" />
                      <label className={`flex items-center justify-center px-3 border border-border rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors ${!enableMediaEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" disabled={!enableMediaEdit} accept="image/*" onChange={(e) => handleProfileUpload(e.target.files[0], 'profileImage', 'assets', 'profile-pic')} className="hidden" />
                        <Image size={16} />
                      </label>
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
                  {draftData.skills.length}
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
                {draftData.skills.filter(s => !recentlyAdded.includes(s)).map((skill, idx) => (
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
                    {draftData.projects.length}
                  </span>
                </h3>
                <button onClick={handleAddProject} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  <Plus size={18} /> New Project
                </button>
              </div>
              <div className="grid gap-6 mt-4">
                {draftData.projects.map((proj, idx) => (
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

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar size={20} className="text-primary" /> Manage Achievements
                  <span className="text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 ml-2">
                    {draftData.achievements.length}
                  </span>
                </h3>
                <button onClick={handleAddAchievement} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  <Plus size={18} /> New Achievement
                </button>
              </div>
              <div className="grid gap-6 mt-4">
                {draftData.achievements.map((ach, idx) => (
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
                    <Layout size={20} /> Page Headers & Subtitles
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
        </AnimatePresence>
      </div>
    </div>
  );
}
