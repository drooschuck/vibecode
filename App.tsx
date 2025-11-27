import React, { useState, useEffect } from 'react';
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
  Layers
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { COURSES, PROJECTS, INITIAL_PROGRESS } from './constants';
import { Course, Lesson, UserProgress, Project } from './types';
import { CodeEditor } from './components/CodeEditor';
import { askAiTutor } from './services/geminiService';

// --- Components Defined Here for Single File Cohesion ---

// 1. Stats Card Component
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
  <div className={`p-6 rounded-2xl text-white shadow-lg relative overflow-hidden ${colorClass} transition-transform hover:scale-105`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
        {icon}
      </div>
    </div>
  </div>
);

// 2. Course Card Component
const CourseCard: React.FC<{ course: Course; onSelect: (c: Course) => void }> = ({ course, onSelect }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
    <div className="flex justify-center mb-6">
      <div className={`w-16 h-16 rounded-full ${course.color} bg-opacity-20 flex items-center justify-center text-4xl shadow-inner`}>
        {course.icon}
      </div>
    </div>
    <h3 className={`text-xl font-bold mb-1 ${course.language === 'Python' ? 'text-blue-600' : course.language === 'Java' ? 'text-orange-600' : 'text-purple-600'}`}>
      {course.title}
    </h3>
    <p className="text-sm text-gray-500 font-medium mb-4">{course.level}</p>
    <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
      {course.description}
    </p>
    
    <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-3 rounded-xl">
      <div className="text-center">
        <p className="text-xl font-bold text-gray-800">{course.lessons.length}</p>
        <p className="text-xs text-gray-500">Lessons</p>
      </div>
      <div className="text-center border-l border-gray-200">
        <p className="text-xl font-bold text-gray-800">0h</p>
        <p className="text-xs text-gray-500">Duration</p>
      </div>
    </div>

    <button 
      onClick={() => onSelect(course)}
      className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-colors ${course.color} hover:brightness-110`}
    >
      Start Learning <ChevronRight size={18} />
    </button>
  </div>
);

// --- Main Application Logic ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'course' | 'project_list'>('dashboard');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [code, setCode] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Basic analytics data for the chart
  const activityData = [
    { name: 'Mon', hours: 1.5 },
    { name: 'Tue', hours: 2.3 },
    { name: 'Wed', hours: 0.5 },
    { name: 'Thu', hours: 3.0 },
    { name: 'Fri', hours: 2.1 },
    { name: 'Sat', hours: 4.0 },
    { name: 'Sun', hours: 1.2 },
  ];

  useEffect(() => {
    if (activeCourse) {
      setCode(activeCourse.lessons[activeLessonIndex].initialCode);
      setAiFeedback(null);
    }
  }, [activeCourse, activeLessonIndex]);

  const handleStartCourse = (course: Course) => {
    setActiveCourse(course);
    setActiveLessonIndex(0);
    setView('course');
  };

  const handleAskAi = async () => {
    if (!activeCourse) return;
    setIsAiLoading(true);
    setAiFeedback(null);
    const currentLesson = activeCourse.lessons[activeLessonIndex];
    
    // Mock context extraction from HTML content (simple regex to strip tags for AI context)
    const context = currentLesson.content.replace(/<[^>]*>?/gm, '');
    
    const feedback = await askAiTutor(code, context, activeCourse.language);
    setAiFeedback(feedback);
    setIsAiLoading(false);
  };

  const handleNextLesson = () => {
    if (!activeCourse) return;
    
    // Mark complete
    const currentLessonId = activeCourse.lessons[activeLessonIndex].id;
    if (!userProgress.completedLessonIds.includes(currentLessonId)) {
      setUserProgress(prev => ({
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, currentLessonId],
        lessonsCompleted: prev.completedLessonIds.length + 1
      }));
    }

    if (activeLessonIndex < activeCourse.lessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
    } else {
      // Course complete logic could go here
      setView('dashboard');
    }
  };

  // --- Views ---

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-blue-600 mb-4 border border-blue-100">
          <Flame size={16} className="text-orange-500 fill-orange-500" /> Welcome to CodeMaster
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Master Programming<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">One Language at a Time</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Learn Python, Java, and C with interactive lessons, hands-on practice, and real-world projects designed for developers.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard 
          title="Hours Learned" 
          value={userProgress.hoursLearned} 
          icon={<Clock size={24} className="text-white" />} 
          colorClass="bg-cyan-400" 
        />
        <StatCard 
          title="Lessons Completed" 
          value={userProgress.completedLessonIds.length} 
          icon={<Code size={24} className="text-white" />} 
          colorClass="bg-emerald-400" 
        />
        <StatCard 
          title="Current Streak" 
          value={`${userProgress.streakDays} days`} 
          icon={<Flame size={24} className="text-white" />} 
          colorClass="bg-amber-400" 
        />
        <StatCard 
          title="Projects Built" 
          value={userProgress.completedProjectIds.length} 
          icon={<Trophy size={24} className="text-white" />} 
          colorClass="bg-purple-400" 
        />
      </div>

      {/* Activity Chart (Optional but satisfies rechart requirement) */}
      <div className="mb-16 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Layout size={20} /> Learning Activity
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Selection */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <BookOpen className="text-blue-600" /> Choose Your Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURSES.map(course => (
            <CourseCard key={course.id} course={course} onSelect={handleStartCourse} />
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
         <div className="flex justify-center mb-4">
            <Code className="w-12 h-12 text-blue-600" />
         </div>
         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Ready to Start Coding?</h2>
         <p className="text-slate-600 mb-8 max-w-xl mx-auto">Jump into our interactive practice lab and start experimenting with code right away.</p>
         <button 
          onClick={() => setView('project_list')}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-200"
         >
            Open Project Lab <Layers size={18} />
         </button>
      </div>
    </div>
  );

  const renderCourseView = () => {
    if (!activeCourse) return null;
    const currentLesson = activeCourse.lessons[activeLessonIndex];

    return (
      <div className="flex flex-col h-screen bg-slate-50">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
               <h2 className="font-bold text-gray-900">{activeCourse.title}</h2>
               <p className="text-xs text-gray-500">Lesson {activeLessonIndex + 1} of {activeCourse.lessons.length}: {currentLesson.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Autosaved
             </div>
             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Run Code
             </button>
          </div>
        </header>

        {/* Main Split Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Lesson Content */}
          <div className="w-full md:w-5/12 lg:w-1/3 p-6 overflow-y-auto border-r border-gray-200 bg-white">
             <div className="prose prose-slate prose-sm max-w-none">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">{currentLesson.title}</h1>
                {/* Rendering HTML content from constant safely */}
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
             </div>

             {/* AI Tutor Feedback Area */}
             {aiFeedback && (
               <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <h4 className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-2">
                    <MessageSquare size={16} /> AI Tutor Feedback
                  </h4>
                  <div className="prose prose-sm text-indigo-900">
                    <React.Markdown>{aiFeedback}</React.Markdown>
                  </div>
               </div>
             )}
             
             <div className="mt-8 flex gap-3">
                <button 
                  onClick={handleAskAi}
                  disabled={isAiLoading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-purple-200 text-purple-700 rounded-xl hover:bg-purple-50 transition-colors font-medium ${isAiLoading ? 'opacity-50' : ''}`}
                >
                   {isAiLoading ? 'Thinking...' : 'Ask AI Helper'} <MessageSquare size={18} />
                </button>
             </div>
          </div>

          {/* Right: Code Editor */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            <div className="flex-1 overflow-hidden p-4">
               <CodeEditor 
                  code={code} 
                  onChange={setCode} 
                  language={activeCourse.language} 
               />
            </div>
            
            {/* Editor Footer / Console Simulation */}
            <div className="h-32 bg-[#1e1e1e] border-t border-gray-800 p-4 overflow-y-auto">
               <p className="font-mono text-xs text-gray-500 mb-2">CONSOLE OUTPUT</p>
               <p className="font-mono text-sm text-green-400">{'>'} Ready for execution...</p>
            </div>

            {/* Navigation Footer */}
            <div className="bg-gray-900 border-t border-gray-800 p-4 flex justify-end">
               <button 
                onClick={handleNextLesson}
                className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
               >
                 {activeLessonIndex < activeCourse.lessons.length - 1 ? 'Next Lesson' : 'Finish Course'} <ChevronRight size={18} />
               </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderProjectList = () => (
    <div className="max-w-5xl mx-auto px-4 py-8">
       <div className="flex items-center gap-4 mb-8">
         <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
         </button>
         <h1 className="text-3xl font-bold text-slate-900">Practice Projects</h1>
       </div>
       
       <div className="grid gap-6">
          {PROJECTS.map(project => (
             <div key={project.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0
                      ${project.language === 'Python' ? 'bg-blue-100 text-blue-600' : 
                        project.language === 'Java' ? 'bg-orange-100 text-orange-600' : 
                        'bg-purple-100 text-purple-600'}`}>
                      {project.language === 'Python' ? '🐍' : project.language === 'Java' ? '☕' : '⚡'}
                   </div>
                   <div>
                      <h3 className="font-bold text-lg text-slate-900">{project.title}</h3>
                      <p className="text-slate-500 text-sm mb-2">{project.description}</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">{project.language}</span>
                        <span className={`px-2 py-1 text-xs rounded-md font-medium border
                           ${project.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-100' : 
                             project.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                             'bg-red-50 text-red-700 border-red-100'}`}>
                           {project.difficulty}
                        </span>
                      </div>
                   </div>
                </div>
                <button className="px-6 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                   View Details
                </button>
             </div>
          ))}
       </div>
    </div>
  );

  // Render Logic
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {view === 'dashboard' && renderDashboard()}
      {view === 'course' && renderCourseView()}
      {view === 'project_list' && renderProjectList()}
    </div>
  );
}