import { useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");
  const firstName = user?.name?.split(" ")[0] ?? user?.name;

  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);
  const completedLessons = courses.reduce(
    (sum, course) => sum + Math.min(completedCount(course.slug), course.lessons.length),
    0
  );

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(q) || course.tagline.toLowerCase().includes(q)
    );
  }, [query]);

  const categories = useMemo(() => {
    const groups = new Map();
    for (const course of filteredCourses) {
      const key = course.category ?? "More Skills";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(course);
    }
    return Array.from(groups.entries());
  }, [filteredCourses]);

  return (
    <div className="app-page">
      <AppHeader />
      <main className="courses-main">
        <section className="courses-hero">
          <h1>Welcome back{firstName ? `, ${firstName}` : ""}</h1>
          <p>Build skills to save lives.</p>
        </section>

        <section className="courses-search">
          <span className="material-symbols-outlined courses-search-icon" aria-hidden="true">
            search
          </span>
          <input
            type="search"
            className="courses-search-input"
            placeholder="Search first aid topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </section>

        <section className="progress-summary">
          <div className="progress-summary-text">
            <h2>Your Learning Path</h2>
            <p>You're making great progress towards certification.</p>
          </div>
          <div className="progress-summary-stat">
            <div className="progress-summary-count">{completedLessons}</div>
            <div className="progress-summary-labels">
              <span className="progress-summary-caption">Lessons Completed</span>
              <span className="progress-summary-total">Out of {totalLessons} total</span>
            </div>
          </div>
        </section>

        {categories.length === 0 && (
          <p className="courses-empty">No topics match "{query}".</p>
        )}

        {categories.map(([category, group]) => (
          <section className="course-category" key={category}>
            <div className="course-category-heading">
              <span className="course-category-bar" />
              <h3>{category}</h3>
            </div>

            <div className="course-row">
              {group.map((course) => {
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
                      <CourseIcon name={course.icon} size={24} />
                    </div>

                    <div className="course-card-body">
                      <h4>{course.title}</h4>
                      <p>{course.tagline}</p>
                    </div>

                    <div className="course-card-footer">
                      <span className="course-card-meta">
                        {done === total ? "Complete" : `${done}/${total} lessons`}
                      </span>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        arrow_forward
                      </span>
                    </div>

                    <div className="course-progress-track">
                      <div className="course-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
