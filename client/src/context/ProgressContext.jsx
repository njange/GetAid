import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as progressApi from "../api/progress";
import { useAuth } from "./AuthContext";

const ProgressContext = createContext(null);

function groupByCourse(rows) {
  const byCourse = {};
  for (const row of rows) {
    if (!byCourse[row.courseSlug]) byCourse[row.courseSlug] = {};
    byCourse[row.courseSlug][row.lessonSlug] = row;
  }
  return byCourse;
}

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProgress({});
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await progressApi.getProgress();
      setProgress(groupByCourse(data.progress));
    } catch {
      setProgress({});
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const completeLesson = useCallback(async (courseSlug, lessonSlug) => {
    const data = await progressApi.completeLesson(courseSlug, lessonSlug);
    setProgress((prev) => {
      const courseProgress = prev[courseSlug] || {};
      const existing = courseProgress[lessonSlug];
      return {
        ...prev,
        [courseSlug]: {
          ...courseProgress,
          [lessonSlug]: {
            courseSlug,
            lessonSlug,
            attempts: (existing?.attempts || 0) + 1,
            lastCompletedAt: data.attempt.completedAt,
          },
        },
      };
    });
    return data.attempt;
  }, []);

  const isLessonComplete = useCallback(
    (courseSlug, lessonSlug) => Boolean(progress[courseSlug]?.[lessonSlug]),
    [progress]
  );

  const completedCount = useCallback(
    (courseSlug) => Object.keys(progress[courseSlug] || {}).length,
    [progress]
  );

  return (
    <ProgressContext.Provider
      value={{ progress, loading, refresh, completeLesson, isLessonComplete, completedCount }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}
