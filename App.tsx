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
  Eye,
  Terminal,
  RotateCcw,
  Key,
  Sun,
  Moon,
  ShieldCheck,
  Keyboard
} from 'lucide-react';
import { COURSES, PROJECTS, INITIAL_PROGRESS } from './constants';
import { Course, Lesson, UserProgress, Project } from './types';
import { CodeEditor } from './components/CodeEditor';
import { askAiTutor } from './services/geminiService';
import { executeInSandbox } from './services/executionService';

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
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col h-full group overflow-hidden">
    <div className={`h-32 ${course.color} flex items-center justify-center relative`}>
        <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
            {course.icon}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/10 backdrop-blur-[2px]"></div>
    </div>
    
    <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
            <h3 className={`text-xl font-bold mb-1 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                {course.title}
            </h3>
            <p className="text-sm text-gray-500 font-medium dark:text-slate-400">{course.level}</p>
        </div>
        
        <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 flex-grow leading-relaxed">
            {course.description}
        </p>
        
        <div className="mt-auto">
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-2 font-medium">
                <span>Progress</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 mb-6">
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
  
  // Persistence
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('softvibe_progress');
      return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
    } catch (e) {
      return INITIAL_PROGRESS;
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('softvibe_theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('softvibe_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('softvibe_theme', 'light');
    }
  }, [isDarkMode]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    localStorage.setItem('softvibe_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // State
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState(''); // Added STDIN state
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [terminalTab, setTerminalTab] = useState<'output' | 'input'>('output');

  const [langFilter, setLangFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const handleConnectKey = async () => {
    // @ts-ignore
    if (window.aistudio && window.aistudio.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleStartCourse = (course: Course) => {
    setActiveCourse(course);
    const firstUnfinishedIndex = course.lessons.findIndex(l => !userProgress.completedLessonIds.includes(l.id));
    const startIndex = firstUnfinishedIndex >= 0 ? firstUnfinishedIndex : 0;
    setActiveLessonIndex(startIndex);
    setCode(course.lessons[startIndex].initialCode);
    setStdin('');
    setOutput('');
    setAiFeedback(null);
    setView('course');
  };

  const handleStartProject = (project: Project) => {
    setActiveProject(project);
    const savedCode = localStorage.getItem(`softvibe_draft_${project.id}`);
    setCode(savedCode || project.starterCode);
    setStdin('');
    setOutput('');
    setAiFeedback(null);
    setView('project_detail');
  };

  const handleRunCode = async () => {
    if (!isOnline) {
      setOutput("Error: Internet connection required for cloud sandbox execution.");
      return;
    }
    
    setIsExecuting(true);
    setOutput("Preparing environment...");
    setTerminalTab('output');
    
    const lang = activeCourse ? activeCourse.language : activeProject ? activeProject.language : 'Python';
    
    try {
      const result = await executeInSandbox(code, lang, stdin);
      setOutput(result);
    } catch (err: any) {
      setOutput(`Execution Error: ${err.message || "Failed to reach sandbox engine."}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAskAi = async (context: string, lang: string) => {
    if (!isOnline) return;
    setIsAiLoading(true);
    setAiFeedback(null);
    try {
      const feedback = await askAiTutor(code, context, lang);
      setAiFeedback(feedback);
    } catch (err: any) {
      setAiFeedback(`Tutor error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCompleteLesson = () => {
    if (!activeCourse) return;
    const currentLessonId = activeCourse.lessons[activeLessonIndex].id;
    if (!userProgress.completedLessonIds.includes(currentLessonId)) {
      setUserProgress(prev => ({
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, currentLessonId],
        hoursLearned: prev.hoursLearned + 0.5
      }));
    }
    if (activeLessonIndex < activeCourse.lessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
      setCode(activeCourse.lessons[activeLessonIndex + 1].initialCode);
      setStdin('');
      setOutput('');
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
    localStorage.removeItem(`softvibe_draft_${activeProject.id}`);
    setTimeout(() => setView('project_list'), 500);
  };

  const renderThemeToggle = () => (
    <button 
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center group"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  const renderTerminal = () => (
    <div className="h-full flex flex-col">
      <div className="bg-[#1e1e1e] border-b border-gray-800 px-2 flex items-center justify-between text-[10px] text-gray-400 font-mono uppercase tracking-wider">
        <div className="flex">
          <button 
            onClick={() => setTerminalTab('output')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-2 ${terminalTab === 'output' ? 'border-blue-500 text-white bg-gray-800/50' : 'border-transparent hover:text-gray-200'}`}
          >
            <Terminal size={12} /> Output
          </button>
          <button 
            onClick={() => setTerminalTab('input')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-2 ${terminalTab === 'input' ? 'border-blue-500 text-white bg-gray-800/50' : 'border-transparent hover:text-gray-200'}`}
          >
            <Keyboard size={12} /> Standard Input (STDIN)
          </button>
        </div>
        <div className="px-4 py-2 text-gray-600">Judge0 CE Sandbox</div>
      </div>
      
      <div className="flex-1 bg-[#151515] overflow-hidden relative">
        {terminalTab === 'output' ? (
          <div className="p-4 h-full overflow-auto font-mono text-sm">
            {output ? (
              <pre className={`${output.includes("Error") ? 'text-red-400' : 'text-emerald-400'} whitespace-pre-wrap`}>{output}</pre>
            ) : (
              <div className="text-gray-600">
                <span className="text-blue-400">softvibe@sandbox:~$</span> Run your code to see the results here.
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className="w-full h-full bg-transparent p-4 font-mono text-sm text-blue-300 outline-none resize-none placeholder-gray-700"
            placeholder="# Type data for input() here...&#10;# One line per input prompt.&#10;# Example:&#10;John&#10;25"
          />
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex justify-end mb-8">{renderThemeToggle()}</div>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6 border border-blue-100 dark:border-blue-800">
          Welcome to softvibe
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-slate-50 mb-6 tracking-tight">
          Master Programming<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">One Language at a Time</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Learn Python, Java, and C with interactive lessons, hands-on practice, and real-world projects powered by Gemini 3 Pro and Judge0 Sandbox.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard title="Hours Learned" value={userProgress.hoursLearned.toFixed(1)} icon={<Clock size={28} className="text-white opacity-80" />} colorClass="bg-sky-400 dark:bg-sky-500" />
        <StatCard title="Lessons Completed" value={userProgress.completedLessonIds.length} icon={<Code size={28} className="text-white opacity-80" />} colorClass="bg-emerald-400 dark:bg-emerald-500" />
        <StatCard title="Current Streak" value={`${userProgress.streakDays} days`} icon={<Flame size={28} className="text-white opacity-80" />} colorClass="bg-amber-400 dark:bg-amber-500" />
        <StatCard title="Projects Built" value={userProgress.completedProjectIds.length} icon={<Trophy size={28} className="text-white opacity-80" />} colorClass="bg-purple-400 dark:bg-purple-500" />
      </div>
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8 flex items-center gap-3">
          <BookOpen className="text-blue-600 dark:text-blue-400" /> Choose Your Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURSES.map(course => {
            const completedLessons = course.lessons.filter(l => userProgress.completedLessonIds.includes(l.id)).length;
            const progress = Math.round((completedLessons / course.lessons.length) * 100);
            return <CourseCard key={course.id} course={course} onSelect={handleStartCourse} progress={progress} />;
          })}
        </div>
      </div>
    </div>
  );

  const renderCourseView = () => {
    if (!activeCourse) return null;
    const currentLesson = activeCourse.lessons[activeLessonIndex];
    const context = currentLesson.content.replace(/<[^>]*>?/gm, '');

    return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-400">
              <ArrowLeft size={20} />
            </button>
            <div>
               <h2 className="font-bold text-gray-900 dark:text-slate-50 flex items-center gap-2">
                 {activeCourse.icon} {activeCourse.title}
               </h2>
               <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  <span className="font-medium text-blue-600 dark:text-blue-400">Lesson {activeLessonIndex + 1}</span>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-slate-700 rounded-full"></span>
                  <span>{currentLesson.title}</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {renderThemeToggle()}
             <button 
                onClick={handleRunCode}
                disabled={isExecuting || !isOnline}
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm ${isExecuting ? 'opacity-70 cursor-wait scale-95' : 'hover:scale-105 active:scale-95'}`}
             >
                {isExecuting ? <RotateCcw className="animate-spin" size={16}/> : <Play size={16} />} 
                {isExecuting ? 'Running...' : 'Run Code'}
             </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-5/12 lg:w-1/3 p-6 overflow-y-auto border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
             <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">{currentLesson.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
             </div>
             {aiFeedback && (
               <div className="mt-8 p-4 border rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30">
                  <h4 className="flex items-center gap-2 font-bold text-sm mb-2 text-indigo-900 dark:text-indigo-300">
                    <MessageSquare size={16} /> Tutor Feedback
                  </h4>
                  <div className="prose prose-sm dark:prose-invert leading-relaxed"><ReactMarkdown>{aiFeedback}</ReactMarkdown></div>
               </div>
             )}
             <div className="mt-8 space-y-3">
                <button 
                  onClick={() => handleAskAi(context, activeCourse.language)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all font-semibold"
                >
                   {isAiLoading ? 'Thinking...' : 'Get AI Help'} <MessageSquare size={18} />
                </button>
                <button onClick={() => setCode(currentLesson.solutionCode)} className="w-full py-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                   <Eye size={16} /> Reveal Solution Code
                </button>
             </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            <div className="h-[65%] flex flex-col border-b border-gray-800 relative overflow-hidden">
               <CodeEditor code={code} onChange={setCode} language={activeCourse.language} isDarkMode={isDarkMode} />
            </div>
            <div className="h-[35%] flex flex-col">
              {renderTerminal()}
              <div className="bg-gray-900 border-t border-gray-800 p-3 flex justify-end items-center shrink-0">
                 <button onClick={handleCompleteLesson} className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm">
                   {activeLessonIndex < activeCourse.lessons.length - 1 ? 'Next Lesson' : 'Finish Course'} <ChevronRight size={18} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectDetail = () => {
    if (!activeProject) return null;
    return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('project_list')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-400">
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-gray-900 dark:text-slate-50">{activeProject.title}</h2>
          </div>
          <div className="flex gap-3">
             <button onClick={handleRunCode} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2">
                <Play size={16} /> Run Code
             </button>
             <button onClick={handleSaveProjectDraft} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-2"><Save size={16} /> Save</button>
             <button onClick={handleSubmitProject} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><CheckCircle size={16} /> Submit</button>
          </div>
        </header>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
           <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="text-lg font-bold mb-4">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{activeProject.description}</p>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-xs flex gap-3">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <p>Sandboxed isolated execution enabled.</p>
              </div>
           </div>
           <div className="flex-1 flex flex-col bg-[#1e1e1e]">
              <div className="h-[65%] overflow-hidden border-b border-gray-800"><CodeEditor code={code} onChange={setCode} language={activeProject.language} isDarkMode={isDarkMode} /></div>
              <div className="h-[35%]">{renderTerminal()}</div>
           </div>
        </div>
      </div>
    );
  };

  const renderProjectList = () => {
    const filteredProjects = PROJECTS.filter(p => (langFilter === 'All' || p.language === langFilter) && (difficultyFilter === 'All' || p.difficulty === difficultyFilter));
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
         <div className="flex items-center gap-4 mb-10">
           <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all"><ArrowLeft size={24} /></button>
           <h1 className="text-3xl font-bold">Practice Lab</h1>
         </div>
         <div className="grid gap-6">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex justify-between items-center group hover:shadow-lg transition-all">
                <div>
                   <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">{project.description}</p>
                </div>
                <button onClick={() => handleStartProject(project)} className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">Start <ChevronRight size={16} /></button>
              </div>
            ))}
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 overflow-x-hidden">
      {!isOnline && <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium sticky top-0 z-[60] flex items-center justify-center gap-2"><WifiOff size={16} /> Working Offline</div>}
      {view === 'dashboard' && renderDashboard()}
      {view === 'course' && renderCourseView()}
      {view === 'project_list' && renderProjectList()}
      {view === 'project_detail' && renderProjectDetail()}
    </div>
  );
}