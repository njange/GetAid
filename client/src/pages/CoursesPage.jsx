import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppHeader } from "../components/AppHeader";
import { CourseIcon } from "../components/CourseIcon";
import { courses } from "../data/courses";
import "./app.css";

export function CoursesPage() {
  const { user } = useAuth();
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
          {courses.map((course) => (
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
              <span className="course-card-meta">{course.lessons.length} lessons →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
