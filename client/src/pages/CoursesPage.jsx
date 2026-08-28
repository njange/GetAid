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

  return (
    <div className="app-page">
      <AppHeader />
      <main className="courses-main">
        <div className="courses-hero">
          <h1>Welcome back{firstName ? `, ${firstName}` : ""}</h1>
          <p>Pick a course to keep building the skills and confidence to help when it counts.</p>
        </div>

        <div className="course-grid">
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
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
