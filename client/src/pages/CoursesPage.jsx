import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { AppHeader } from "../components/AppHeader";
import { CourseIcon } from "../components/CourseIcon";
import { courses } from "../data/courses";
import "./app.css";

export function CoursesPage() {
  const { user } = useAuth();
  const { completedCount } = useProgress();
  const firstName = user?.name?.split(" ")[0] ?? user?.name;

            const totalLessons = courses.reduce(
  (sum, course) => sum + course.lessons.length,
  0
);

const completedLessons = courses.reduce(
  (sum, course) =>
    sum + Math.min(completedCount(course.slug), course.lessons.length),
  0
);

const overallProgress =
  totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  
  return (
    <div className="app-page">
      <AppHeader />
      <main className="courses-main">
        <section className="courses-hero">
          <span className="hero-badge">First Aid Guide</span>
          <h1>Welcome back{firstName ? `, ${firstName}` : ""}</h1>
          <p>Build Skills to Save Lives.</p>
         </section>
        
           <section className="stats-grid">
             <div className="stat-card stat-red">
               <h3>Courses Available</h3>
               <h3>{courses.length}</h3>
               <p>Modules to Learn</p>
              </div>

 
                <div className="stat-card stat-blue">
                  <h3>Active Path</h3>
                  <p>{overallProgress}% Complete</p>
                </div>

                <div className="stat-card stat-emergency">
                  <span>Emergency Calling Protocols</span>
                </div>
            </section>

        <div className="access-btn">
          Access Hub
        </div>
      </div>
</section>

<h3 className="learning-title">
Your Learning Path
</h3>
        <section className="course-grid">
          {courses.map((course) => {
            const total = course.lessons.length;
            const done = Math.min(completedCount(course.slug), total);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Link
                key={course.slug}
                to={`/courses/${course.slug}/lessons/${course.lessons[0].slug}`}
                className="course-card"
              >
                <div className="course-card-icon">
                  <CourseIcon name={course.icon} />
                </div>

                <div className="course-card-content">
                <h2>{course.title}</h2>
                <p>{course.tagline}</p>
                <div className="course-progress">
                  <div className="course-progress-track">
                    <div className="course-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="course-card-meta">
                    {done === total && total > 0 ? "Complete" : `${done} of ${total} lessons complete`}
                  </span>
                  </div>
                  <div className="course-card-footer">
                    <span className="progress-label">
                      {pct} > 0
                      ? "In Progress"
                    </span>

                    <span className="progress-percent">
                      {pct}%
                    </span>
                  </div>
                  
                    <span className="course-button">
                      Continue Learning
                    </span>
                    
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
