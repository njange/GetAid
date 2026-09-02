import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { AppHeader } from "../components/AppHeader";
import { CourseIcon } from "../components/CourseIcon";
import { courses } from "../data/courses";
import "./app.css";

export function ProgressPage() {
  const { completedCount } = useProgress();

  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);
  const completedLessons = courses.reduce(
    (sum, course) => sum + Math.min(completedCount(course.slug), course.lessons.length),
    0
  );
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="app-page">
      <AppHeader />
      <main className="courses-main">
        <section className="courses-hero">
          <h1>Your Progress</h1>
          <p>Track how far you've come across every course.</p>
        </section>

        <section className="progress-summary">
          <div className="progress-summary-text">
            <h2>Overall Completion</h2>
            <p>{overallPct}% of all lessons completed.</p>
          </div>
          <div className="progress-summary-stat">
            <div className="progress-summary-count">{completedLessons}</div>
            <div className="progress-summary-labels">
              <span className="progress-summary-caption">Lessons Completed</span>
              <span className="progress-summary-total">Out of {totalLessons} total</span>
            </div>
          </div>
        </section>

        <section className="course-category">
          <div className="course-category-heading">
            <span className="course-category-bar" />
            <h3>By Course</h3>
          </div>

          <div className="progress-list">
            {courses.map((course) => {
              const total = course.lessons.length;
              const done = Math.min(completedCount(course.slug), total);
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <Link key={course.slug} to={`/courses/${course.slug}`} className="progress-row">
                  <div className="progress-row-icon">
                    <CourseIcon name={course.icon} size={22} />
                  </div>
                  <div className="progress-row-body">
                    <div className="progress-row-heading">
                      <span className="progress-row-title">{course.title}</span>
                      <span className="progress-row-meta">
                        {done === total ? "Complete" : `${done}/${total} lessons`}
                      </span>
                    </div>
                    <div className="course-progress-track">
                      <div className="course-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
