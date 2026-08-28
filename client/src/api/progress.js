import { apiFetch } from "./client";

export function getProgress() {
  return apiFetch("/progress");
}

export function getLessonAttempts(courseSlug, lessonSlug) {
  return apiFetch(`/progress/lessons/${courseSlug}/${lessonSlug}`);
}

export function completeLesson(courseSlug, lessonSlug) {
  return apiFetch(`/progress/lessons/${courseSlug}/${lessonSlug}/complete`, {
    method: "POST",
  });
}
