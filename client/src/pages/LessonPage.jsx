import { Link, Navigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { getLesson } from "../data/courses";
import "./app.css";

function LessonBlock({ block }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "steps":
      return (
        <ol className="lesson-steps">
          {block.items.map((item, i) => (
            <li key={i}>
              <span className="lesson-step-index">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "warning":
      return <div className="lesson-callout warning">⚠ {block.text}</div>;
    case "tip":
      return <div className="lesson-callout tip">💡 {block.text}</div>;
    default:
      return null;
  }
}

export function LessonPage() {
  const { courseSlug, lessonSlug } = useParams();
  const { course, lesson, index } = getLesson(courseSlug, lessonSlug);

  if (!course || !lesson) {
    return <Navigate to="/" replace />;
  }

  const prevLesson = course.lessons[index - 1];
  const nextLesson = course.lessons[index + 1];

  return (
    <div className="app-page">
      <AppHeader />
      <main className="lesson-main">
        <Link to="/" className="lesson-breadcrumb">
          ← Back to courses
        </Link>

        <div className="lesson-layout">
          <nav className="lesson-sidebar">
            <p className="lesson-sidebar-title">{course.title}</p>
            {course.lessons.map((l, i) => (
              <Link
                key={l.slug}
                to={`/courses/${course.slug}/lessons/${l.slug}`}
                className={`lesson-nav-item${l.slug === lessonSlug ? " active" : ""}`}
              >
                <span className="lesson-nav-index">{i + 1}</span>
                <span>{l.title}</span>
              </Link>
            ))}
          </nav>

          <article className="lesson-content" key={lesson.slug}>
            <div className="lesson-eyebrow">
              <span>{course.title}</span>
            </div>
            <h1>{lesson.title}</h1>
            <p className="lesson-meta">
              Lesson {index + 1} of {course.lessons.length} · {lesson.minutes} min read
            </p>

            <div className="lesson-body">
              {lesson.body.map((block, i) => (
                <LessonBlock key={i} block={block} index={i} />
              ))}
            </div>

            <div className="lesson-footer-nav">
              {prevLesson ? (
                <Link
                  to={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="lesson-nav-button prev"
                >
                  <span>← Previous</span>
                  <span>{prevLesson.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {nextLesson ? (
                <Link
                  to={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="lesson-nav-button next"
                >
                  <span>Next →</span>
                  <span>{nextLesson.title}</span>
                </Link>
              ) : (
                <Link to="/" className="lesson-nav-button next">
                  <span>Course complete</span>
                  <span>Back to all courses</span>
                </Link>
              )}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
