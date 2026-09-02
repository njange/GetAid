import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { AppHeader } from "../components/AppHeader";
import { courses } from "../data/courses";
import "./app.css";

export function HubPage() {
  const { user } = useAuth();
  const { completedCount } = useProgress();
  const firstName = user?.name?.split(" ")[0] ?? user?.name;

  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);
  const completedLessons = courses.reduce(
    (sum, course) => sum + Math.min(completedCount(course.slug), course.lessons.length),
    0
  );
  const nextCourse = courses.find(
    (course) => completedCount(course.slug) < course.lessons.length
  );

  return (
    <div className="app-page">
      <AppHeader />
      <main className="courses-main">
        <section className="courses-hero">
          <h1>Welcome back{firstName ? `, ${firstName}` : ""}</h1>
          <p>Here's a quick look at where you left off.</p>
        </section>

        <div className="hub-grid">
          <div className="hub-card">
            <span className="hub-card-label">Lessons completed</span>
            <span className="hub-card-value">
              {completedLessons}
              <span className="hub-card-value-total">/{totalLessons}</span>
            </span>
          </div>
          <div className="hub-card">
            <span className="hub-card-label">Courses in progress</span>
            <span className="hub-card-value">
              {courses.filter((c) => completedCount(c.slug) > 0 && completedCount(c.slug) < c.lessons.length).length}
            </span>
          </div>
        </div>

        {nextCourse && (
          <section className="hub-continue">
            <div>
              <span className="hub-continue-eyebrow">Continue learning</span>
              <h3>{nextCourse.title}</h3>
              <p>{nextCourse.tagline}</p>
            </div>
            <Link to={`/courses/${nextCourse.slug}`} className="hub-continue-button">
              Resume
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </section>
        )}

        <section className="hub-links">
          <Link to="/" className="hub-link-card">
            <h4>Browse Learning</h4>
            <p>See every course, grouped by skill.</p>
          </Link>
          <Link to="/progress" className="hub-link-card">
            <h4>View Progress</h4>
            <p>Track completion across all courses.</p>
          </Link>
        </section>
      </main>
    </div>
  );
}
