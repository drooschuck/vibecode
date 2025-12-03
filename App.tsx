import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  BookOpen, 
  Code, 
  Trophy, 
  Clock, 
  Flame, 
  Layout, 
  ChevronRight, 
  CheckCircle,
  Play,
  MessageSquare,
  ArrowLeft,
  Layers,
  Wifi,
  WifiOff,
  Filter,
  Save,
  Check,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { COURSES, PROJECTS, INITIAL_PROGRESS } from './constants';
import { Course, Lesson, UserProgress, Project } from './types';
import { CodeEditor } from './components/CodeEditor';
import { askAiTutor } from './services/geminiService';

// --- Helper Components ---

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
  <div className={`p-6 rounded-2xl text-white shadow-md relative overflow-hidden ${colorClass} transition-transform hover:scale-[1.02]`}>
    <div className="flex justify-between items-start h-full">
      <div className="flex flex-col justify-between h-full">
        <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
        <h3 className="text-4xl font-extrabold tracking-tight">{value}</h3>
      </div>
      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
        {icon}
      </div>
    </div>
  </div>
);

const CourseCard: React.FC<{ course: Course; onSelect: (c: Course) => void; progress: number }> = ({ course, onSelect, progress }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group overflow-hidden">
    <div className={`h-32 ${course.color} flex items-center justify-center relative`}>
        <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
            {course.icon}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/10 backdrop-blur-[2px]"></div>
    </div>
    
    <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
            <h3 className={`text-xl font-bold mb-1 text-slate-900 group-hover:text-blue-600 transition-colors`}>
                {course.title}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{course.level}</p>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
            {course.description}
        </p>
        
        <div className="mt-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                <span>Progress</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                <div 
                    className={`h-2 rounded-full ${course.color}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <button 
                onClick={() => onSelect(course)}
                className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${course.color} hover:brightness-105 shadow-md hover:shadow-lg`}
            >
                {progress > 0 ? 'Continue' : 'Start Learning'} <ChevronRight size={18} />
            </button>
        </div>
    </div>
  </div>
);

// --- Main Application ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'course' | 'project_list' | 'project_detail'>('dashboard');
  
  // Persistence: Initialize state from local storage
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('softvibe_progress');
      return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
    } catch (e) {
      return INITIAL_PROGRESS;
    }
  });

  // Offline Detection
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    localStorage.setItem('softvibe_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Application State
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  const [code, setCode] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Filters
  const [langFilter, setLangFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // Chart Data
  const activityData = [
    { name: 'Mon', hours: userProgress.hoursLearned > 0 ? 1.5 : 0 },
    { name: 'Tue', hours: userProgress.hoursLearned > 2 ? 2.0 : 0 },
    { name: 'Wed', hours: userProgress.hoursLearned > 5 ? 3.5 : 0 },
    { name: 'Thu', hours: userProgress.hoursLearned > 10 ? 2.0 : 0 },
    { name: 'Fri', hours: 0 },
    { name: 'Sat', hours: 0 },
    { name: 'Sun', hours: 0 },
  ];

  // --- Handlers ---

  const handleStartCourse = (course: Course) => {
    setActiveCourse(course);
    // Find the first unfinished lesson or default to 0
    const firstUnfinishedIndex = course.lessons.findIndex(l => !userProgress.completedLessonIds.includes(l.id));
    const startIndex = firstUnfinishedIndex >= 0 ? firstUnfinishedIndex : 0;
    
    setActiveLessonIndex(startIndex);
    setCode(course.lessons[startIndex].initialCode);
    setAiFeedback(null);
    setView('course');
  };

  const handleStartProject = (project: Project) => {
    setActiveProject(project);
    // Check if we have saved code for this project (persistence for draft work)
    const savedCode = localStorage.getItem(`softvibe_draft_${project.id}`);
    setCode(savedCode || project.starterCode);
    setAiFeedback(null);
    setView('project_detail');
  };

  const handleAskAi = async (context: string, lang: string) => {
    if (!isOnline) return;
    setIsAiLoading(true);
    setAiFeedback(null);
    
    const feedback = await askAiTutor(code, context, lang);
    setAiFeedback(feedback);
    setIsAiLoading(false);
  };

  const handleCompleteLesson = () => {
    if (!activeCourse) return;
    const currentLessonId = activeCourse.lessons[activeLessonIndex].id;
    
    if (!userProgress.completedLessonIds.includes(currentLessonId)) {
      setUserProgress(prev => ({
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, currentLessonId],
        hoursLearned: prev.hoursLearned + 0.5 // Simulate time spent
      }));
    }

    if (activeLessonIndex < activeCourse.lessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
      setCode(activeCourse.lessons[activeLessonIndex + 1].initialCode);
      setAiFeedback(null);
    } else {
      setView('dashboard');
    }
  };

  const handleSaveProjectDraft = () => {
    if (!activeProject) return;
    localStorage.setItem(`softvibe_draft_${activeProject.id}`, code);
    alert('Progress saved locally!');
  };

  const handleSubmitProject = () => {
    if (!activeProject) return;
    if (!userProgress.completedProjectIds.includes(activeProject.id)) {
      setUserProgress(prev => ({
        ...prev,
        completedProjectIds: [...prev.completedProjectIds, activeProject.id],
        hoursLearned: prev.hoursLearned + 2
      }));
    }
    // Clear draft upon submission
    localStorage.removeItem(`softvibe_draft_${activeProject.id}`);
    
    // Simple visual feedback before going back
    setTimeout(() => setView('project_list'), 500);
  };

  // --- Views ---

  const renderOfflineBanner = () => (
    !isOnline && (
      <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 animate-pulse sticky top-0 z-50">
        <WifiOff size={16} /> You are currently offline. Progress will be saved locally. AI features are disabled.
      </div>
    )
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-blue-600 mb-6 border border-blue-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Welcome to softvibe
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Master Programming<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">One Language at a Time</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Learn Python, Java, and C with interactive lessons, hands-on practice, and real-world projects designed for Windows developers.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard 
          title="Hours Learned" 
          value={userProgress.hoursLearned.toFixed(1)} 
          icon={<Clock size={28} className="text-white opacity-80" />} 
          colorClass="bg-sky-400" 
        />
        <StatCard 
          title="Lessons Completed" 
          value={userProgress.completedLessonIds.length} 
          icon={<Code size={28} className="text-white opacity-80" />} 
          colorClass="bg-emerald-400" 
        />
        <StatCard 
          title="Current Streak" 
          value={`${userProgress.streakDays} days`} 
          icon={<Flame size={28} className="text-white opacity-80" />} 
          colorClass="bg-amber-400" 
        />
        <StatCard 
          title="Projects Built" 
          value={userProgress.completedProjectIds.length} 
          icon={<Trophy size={28} className="text-white opacity-80" />} 
          colorClass="bg-purple-400" 
        />
      </div>

      {/* Course Selection */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <BookOpen className="text-blue-600" /> Choose Your Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURSES.map(course => {
            const completedLessons = course.lessons.filter(l => userProgress.completedLessonIds.includes(l.id)).length;
            const progress = Math.round((completedLessons / course.lessons.length) * 100);
            return (
              <CourseCard key={course.id} course={course} onSelect={handleStartCourse} progress={progress} />
            );
          })}
        </div>
      </div>
      
      {/* Practice Lab CTA */}
      <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-lg border border-gray-100 relative overflow-hidden mb-12">
         <div className="relative z-10 max-w-3xl mx-auto">
           <div className="flex justify-center mb-6">
              <div className="bg-indigo-50 p-4 rounded-2xl">
                <Code className="w-10 h-10 text-indigo-600" />
              </div>
           </div>
           <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Start Coding?</h2>
           <p className="text-slate-600 mb-8 max-w-xl mx-auto">Jump into our interactive practice lab and start experimenting with code right away.</p>
           <button 
            onClick={() => setView('project_list')}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-200"
           >
             <Layout size={20} /> Open Practice Lab
           </button>
         </div>
      </div>
    </div>
  );

  const renderCourseView = () => {
    if (!activeCourse) return null;
    const currentLesson = activeCourse.lessons[activeLessonIndex];
    const context = currentLesson.content.replace(/<[^>]*>?/gm, '');

    return (
      <div className="flex flex-col h-screen bg-slate-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
               <h2 className="font-bold text-gray-900 flex items-center gap-2">
                 {activeCourse.icon} {activeCourse.title}
               </h2>
               <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span className="font-medium text-blue-600">Lesson {activeLessonIndex + 1}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{currentLesson.title}</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div> 
                {isOnline ? 'Online' : 'Offline Mode'}
             </div>
             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <Play size={16} /> Run Code
             </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Lesson Content */}
          <div className="w-full md:w-5/12 lg:w-1/3 p-6 overflow-y-auto border-r border-gray-200 bg-white">
             <div className="prose prose-slate prose-sm max-w-none">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">{currentLesson.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
             </div>

             {/* AI Feedback */}
             {aiFeedback && (
               <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-2">
                    <MessageSquare size={16} /> AI Tutor Feedback
                  </h4>
                  <div className="prose prose-sm text-indigo-900 leading-relaxed">
                    <ReactMarkdown>{aiFeedback}</ReactMarkdown>
                  </div>
               </div>
             )}
             
             <div className="mt-8 space-y-3">
                <button 
                  onClick={() => handleAskAi(context, activeCourse.language)}
                  disabled={isAiLoading || !isOnline}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-colors font-semibold ${isAiLoading || !isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                   {isAiLoading ? 'Thinking...' : isOnline ? 'Get AI Help' : 'AI Unavailable (Offline)'} <MessageSquare size={18} />
                </button>

                <button 
                  onClick={() => {
                    if (window.confirm("This will replace your current code with the solution. Are you sure?")) {
                      setCode(currentLesson.solutionCode);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                   <Eye size={16} /> Reveal Solution Code
                </button>
             </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            <div className="flex-1 overflow-hidden">
               <CodeEditor 
                  code={code} 
                  onChange={setCode} 
                  language={activeCourse.language} 
               />
            </div>
            
            <div className="bg-gray-900 border-t border-gray-800 p-4 flex justify-between items-center">
               <span className="text-gray-500 text-xs font-mono">Console Ready</span>
               <button 
                onClick={handleCompleteLesson}
                className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
               >
                 {activeLessonIndex < activeCourse.lessons.length - 1 ? 'Next Lesson' : 'Finish Course'} <ChevronRight size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectDetail = () => {
    if (!activeProject) return null;
    const isCompleted = userProgress.completedProjectIds.includes(activeProject.id);

    return (
      <div className="flex flex-col h-screen bg-slate-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('project_list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
               <h2 className="font-bold text-gray-900 flex items-center gap-2">
                 <Layers size={20} className="text-blue-600"/> {activeProject.title}
               </h2>
               <div className="flex gap-2 mt-1">
                 <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{activeProject.language}</span>
                 <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{activeProject.difficulty}</span>
               </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleSaveProjectDraft}
               className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center gap-2"
             >
               <Save size={16} /> Save Draft
             </button>
             <button 
               onClick={handleSubmitProject}
               className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all
               ${isCompleted ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
             >
                {isCompleted ? <><Check size={16}/> Completed</> : <><CheckCircle size={16}/> Submit Project</>}
             </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
           {/* Project Instructions */}
           <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-gray-200 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Requirements</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{activeProject.description}</p>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                <h4 className="font-semibold text-blue-800 text-sm mb-2">Tips</h4>
                <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>Break down the problem into small functions.</li>
                  <li>Use comments to plan your logic.</li>
                  <li>Check console output for errors.</li>
                </ul>
              </div>

              {aiFeedback && (
               <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <h4 className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-2">
                    <MessageSquare size={16} /> AI Assistant
                  </h4>
                  <div className="prose prose-sm text-indigo-900">
                    <ReactMarkdown>{aiFeedback}</ReactMarkdown>
                  </div>
               </div>
              )}

              <button 
                  onClick={() => handleAskAi(activeProject.description, activeProject.language)}
                  disabled={isAiLoading || !isOnline}
                  className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm ${isAiLoading || !isOnline ? 'opacity-50' : ''}`}
              >
                  {isAiLoading ? 'Analyzing...' : 'Ask for a Hint'}
              </button>
           </div>

           {/* Editor */}
           <div className="flex-1 flex flex-col bg-[#1e1e1e]">
              <div className="flex-1 overflow-hidden">
                <CodeEditor code={code} onChange={setCode} language={activeProject.language} />
              </div>
              <div className="h-32 bg-[#1e1e1e] border-t border-gray-800 p-4 overflow-y-auto font-mono text-sm">
                <div className="text-gray-500 text-xs mb-2">OUTPUT TERMINAL</div>
                <div className="text-green-400">$ Project workspace ready...</div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderProjectList = () => {
    const filteredProjects = PROJECTS.filter(p => {
      const matchLang = langFilter === 'All' || p.language === langFilter;
      const matchDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      return matchLang && matchDiff;
    });

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
           <div className="flex items-center gap-4">
             <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
                <ArrowLeft size={24} className="text-slate-600" />
             </button>
             <div>
               <h1 className="text-3xl font-bold text-slate-900">Practice Lab</h1>
               <p className="text-slate-500 mt-1">Real-world challenges to test your skills</p>
             </div>
           </div>
           
           <div className="flex gap-3">
             <div className="relative">
               <select 
                className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
               >
                 <option value="All">All Languages</option>
                 <option value="Python">Python</option>
                 <option value="Java">Java</option>
                 <option value="C">C</option>
               </select>
               <Filter size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
             </div>
             <div className="relative">
               <select 
                className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
               >
                 <option value="All">All Levels</option>
                 <option value="Beginner">Beginner</option>
                 <option value="Intermediate">Intermediate</option>
                 <option value="Advanced">Advanced</option>
               </select>
               <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">▼</div>
             </div>
           </div>
         </div>
         
         <div className="grid gap-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-500">No projects found matching your filters.</p>
              </div>
            ) : (
              filteredProjects.map(project => {
                const isDone = userProgress.completedProjectIds.includes(project.id);
                return (
                 <div key={project.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-shadow group">
                    <div className="flex gap-5 w-full md:w-auto">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-colors
                          ${project.language === 'Python' ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100' : 
                            project.language === 'Java' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' : 
                            'bg-violet-50 text-violet-600 group-hover:bg-violet-100'}`}>
                          {project.language === 'Python' ? '🐍' : project.language === 'Java' ? '☕' : '⚡'}
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-lg text-slate-900">{project.title}</h3>
                             {isDone && <CheckCircle size={16} className="text-green-500 fill-green-100" />}
                          </div>
                          <p className="text-slate-500 text-sm mb-3 line-clamp-2 md:line-clamp-1 max-w-xl">{project.description}</p>
                          <div className="flex gap-2">
                            <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-md font-medium border border-gray-100">{project.language}</span>
                            <span className={`px-2.5 py-1 text-xs rounded-md font-medium border
                               ${project.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-100' : 
                                 project.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                                 'bg-red-50 text-red-700 border-red-100'}`}>
                               {project.difficulty}
                            </span>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleStartProject(project)}
                      className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shadow-md shadow-slate-200 flex items-center justify-center gap-2"
                    >
                       {isDone ? 'Review Code' : 'Start Project'} <ChevronRight size={16} />
                    </button>
                 </div>
              )})
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {renderOfflineBanner()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'course' && renderCourseView()}
      {view === 'project_list' && renderProjectList()}
      {view === 'project_detail' && renderProjectDetail()}
    </div>
  );
}