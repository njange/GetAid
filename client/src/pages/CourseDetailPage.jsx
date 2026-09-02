import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { CourseIcon } from "../components/CourseIcon";
import { getCourse } from "../data/courses";
import "./course-detail.css";

export function CourseDetailPage() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const course = getCourse(courseSlug);
  const { isLessonComplete, completedCount } = useProgress();

  if (!course) {
    return <Navigate to="/" replace />;
  }

  const total = course.lessons.length;
  const done = Math.min(completedCount(course.slug), total);
  const nextLesson =
    course.lessons.find((lesson) => !isLessonComplete(course.slug, lesson.slug)) ??
    course.lessons[total - 1];
  const ctaLabel = done === 0 ? "Start Learning" : done >= total ? "Review Course" : "Continue Learning";

  return (
    <div className="course-detail">
      <div className="course-detail-backnav">
        <button
          type="button"
          className="course-detail-back-btn"
          onClick={() => navigate("/")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          Back to Learning
        </button>
      </div>

      <main className="course-detail-main">
        <section className="course-detail-hero-section">
          <div className="course-detail-hero">
            <CourseIcon name={course.icon} size={72} />
          </div>
          <span className="course-detail-eyebrow">{course.category ?? "Course"}</span>
          <h1 className="course-detail-title">{course.title}</h1>
          <p className="course-detail-description">{course.tagline}</p>
        </section>

        {course.objectives && (
          <section className="course-detail-section">
            <h2>Learning Objectives</h2>
            <div className="objectives-grid">
              {course.objectives.map((objective) => (
                <div className="objective-card" key={objective.title}>
                  <span className="material-symbols-outlined objective-icon" aria-hidden="true">
                    {objective.icon}
                  </span>
                  <div>
                    <h3>{objective.title}</h3>
                    <p>{objective.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="course-detail-section">
          <h2>What's Covered</h2>
          <div className="module-list">
            {course.lessons.map((lesson, index) => {
              const complete = isLessonComplete(course.slug, lesson.slug);
              return (
                <Link
                  key={lesson.slug}
                  to={`/courses/${course.slug}/lessons/${lesson.slug}`}
                  className="module-row"
                >
                  <span className={`module-icon${complete ? " complete" : ""}`}>
                    {complete ? (
                      <span className="material-symbols-outlined" aria-hidden="true">
                        check
                      </span>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="module-body">
                    <span className="module-title">{lesson.title}</span>
                    <span className="module-meta">{lesson.minutes} min lesson</span>
                  </span>
                  <span className="material-symbols-outlined module-chevron" aria-hidden="true">
                    chevron_right
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <div className="course-detail-cta-bar">
        <Link
          to={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
          className="course-detail-cta-button"
        >
          {ctaLabel}
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
      </div>
      <div className="course-detail-cta-spacer" />
    </div>
  );
}
