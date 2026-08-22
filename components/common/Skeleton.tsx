'use client';

/**
 * Skeleton.tsx — Shared shimmer skeleton system
 * ----------------------------------------------------
 * Design: warm neutral #e8e5e0 base + cream shimmer wave
 * Animation: CSS skeleton-wave keyframe (globals.css)
 * Entrance: Framer Motion stagger after data loads
 * ----------------------------------------------------
 */

import React from 'react';
import { motion } from 'motion/react';

// ─── Primitive Blocks ─────────────────────────────────────────────────────────

/** Base shimmer block. Accepts any Tailwind sizing / rounding classes. */
export function Sk({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

/** Single text line of configurable width */
export function SkText({ width = 'w-full', className = '' }: { width?: string; className?: string }) {
  return <Sk className={`h-3 rounded-full ${width} ${className}`} />;
}

/** Stacked text lines mimicking a paragraph */
export function SkParagraph({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3'];
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkText key={i} width={widths[i % widths.length]} />
      ))}
    </div>
  );
}

/** Avatar / icon circle */
export function SkCircle({ size = 'w-10 h-10', className = '' }: { size?: string; className?: string }) {
  return <Sk className={`rounded-full ${size} shrink-0 ${className}`} />;
}

/** Image / cover block */
export function SkImage({ className = '' }: { className?: string }) {
  return <Sk className={`w-full aspect-[16/10] rounded-2xl ${className}`} />;
}

/** KPI metric chip — mimics the header stat pills on all dashboards */
export function SkKpiChip({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white px-4 py-2.5 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3 ${className}`}>
      <Sk className="w-8 h-8 rounded-xl" />
      <div className="flex flex-col gap-1.5">
        <Sk className="h-2.5 w-16 rounded-full" />
        <Sk className="h-3.5 w-12 rounded-full" />
      </div>
    </div>
  );
}

/** Dashboard KPI card — icon + label + big number */
export function SkStatCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white p-5 rounded-3xl border border-black/5 shadow-xs flex items-center gap-4 ${className}`}>
      <Sk className="w-12 h-12 rounded-2xl shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Sk className="h-2.5 w-24 rounded-full" />
        <Sk className="h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

/** Course card skeleton — mirrors the double-bezel course card */
export function SkCourseCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-[2rem] bg-[#d5d1cb] p-1.5 ${className}`}>
      <div className="rounded-[calc(2rem-0.375rem)] bg-white p-5 flex flex-col gap-4">
        {/* cover image */}
        <Sk className="w-full aspect-[16/10] rounded-2xl" />

        {/* teacher bar */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <Sk className="w-9 h-9 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Sk className="h-3 w-24 rounded-full" />
              <Sk className="h-2.5 w-16 rounded-full" />
            </div>
          </div>
          <Sk className="h-6 w-12 rounded-full" />
        </div>

        {/* title */}
        <Sk className="h-5 w-4/5 rounded-lg" />
        {/* subtitle */}
        <SkParagraph lines={2} />

        {/* metrics strip */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl skeleton-shimmer">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Sk className="h-4 w-12 rounded-md" />
              <Sk className="h-2.5 w-10 rounded-full" />
            </div>
          ))}
        </div>

        {/* CTA button */}
        <Sk className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

/** Teacher course management card (smaller, used in /teacher/dashboard) */
export function SkTeacherCourseCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-3xl p-5 border border-black/5 shadow-xs flex flex-col gap-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Sk className="w-16 h-16 rounded-2xl shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Sk className="h-2.5 w-16 rounded-md" />
          <Sk className="h-4 w-full rounded-lg" />
          <Sk className="h-3 w-20 rounded-full" />
        </div>
      </div>
      <div className="pt-3 border-t border-black/5 flex gap-2">
        <Sk className="h-9 flex-1 rounded-xl" />
        <Sk className="h-9 w-9 rounded-xl" />
      </div>
    </div>
  );
}

/** Submission row skeleton */
export function SkSubmissionRow({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-4 border border-black/5 shadow-xs flex items-center gap-4 ${className}`}>
      <Sk className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Sk className="h-3.5 w-32 rounded-full" />
        <Sk className="h-2.5 w-24 rounded-full" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <Sk className="h-7 w-14 rounded-xl" />
        <Sk className="h-2.5 w-20 rounded-full" />
      </div>
    </div>
  );
}

/** Code table row skeleton */
export function SkCodeRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 py-3 px-4 border-b border-black/5 ${className}`}>
      <Sk className="h-3 w-32 rounded-full flex-1" />
      <Sk className="h-5 w-16 rounded-full" />
      <Sk className="h-5 w-20 rounded-full" />
      <Sk className="w-8 h-8 rounded-full" />
    </div>
  );
}

/** Syllabus item row skeleton (course classroom) */
export function SkSyllabusItem({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${className}`}>
      <Sk className="w-8 h-8 rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Sk className="h-3 w-3/4 rounded-full" />
        <Sk className="h-2.5 w-1/2 rounded-full" />
      </div>
      <Sk className="w-8 h-8 rounded-lg shrink-0" />
    </div>
  );
}

// ─── Page-Level Skeleton Compositions ────────────────────────────────────────

/**
 * Skeleton for /lessons and homepage CourseList
 * 3-column grid of course cards
 */
export function LessonsPageSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3">
        <Sk className="h-8 w-48 rounded-xl" />
        <Sk className="h-4 w-64 rounded-full" />
      </div>

      {/* Category tabs */}
      <div className="flex gap-3 mb-8 overflow-x-hidden">
        {[1, 2, 3, 4].map((i) => (
          <Sk key={i} className="h-9 w-28 rounded-full shrink-0" />
        ))}
      </div>

      {/* Course cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkCourseCard key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for /student/dashboard
 */
export function StudentDashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-10">
      {/* Header + KPI chips */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 pb-8">
        <div className="flex flex-col gap-2">
          <Sk className="h-8 w-64 rounded-xl" />
          <Sk className="h-4 w-48 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          <SkKpiChip />
          <SkKpiChip />
          <SkKpiChip />
        </div>
      </div>

      {/* Code redemption card */}
      <div className="rounded-[2rem] bg-[#d5d1cb] p-1.5">
        <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sk className="w-8 h-8 rounded-xl" />
              <Sk className="h-5 w-48 rounded-lg" />
            </div>
            <SkParagraph lines={2} />
          </div>
          <div className="w-full md:w-80 flex flex-col gap-2">
            <div className="flex gap-2">
              <Sk className="flex-1 h-12 rounded-xl" />
              <Sk className="h-12 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* My courses section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Sk className="h-6 w-40 rounded-lg" />
          <Sk className="h-4 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkTeacherCourseCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for /teacher/dashboard
 */
export function TeacherDashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 pb-8">
        <div className="flex flex-col gap-2">
          <Sk className="h-9 w-72 rounded-xl" />
          <Sk className="h-4 w-52 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <Sk className="h-11 w-32 rounded-xl" />
          <Sk className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* KPI bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkStatCard key={i} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: courses */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Sk className="h-6 w-36 rounded-lg" />
            <Sk className="h-4 w-28 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkTeacherCourseCard key={i} />
            ))}
          </div>
        </div>

        {/* Right col: recent submissions */}
        <div className="flex flex-col gap-4">
          <Sk className="h-6 w-40 rounded-lg" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkSubmissionRow key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for /teacher/courses
 */
export function TeacherCoursesPageSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-6">
        <div className="flex flex-col gap-2">
          <Sk className="h-8 w-56 rounded-xl" />
          <Sk className="h-4 w-72 rounded-full" />
        </div>
        <Sk className="h-11 w-40 rounded-xl" />
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Sk className="h-11 w-full sm:w-80 rounded-xl" />
        <Sk className="h-6 w-24 rounded-full" />
      </div>

      {/* Course cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkTeacherCourseCard key={i} className="rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for /teacher/submissions
 */
export function TeacherSubmissionsSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-8">
      {/* Header + stat chips */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
        <div className="flex flex-col gap-2">
          <Sk className="h-8 w-52 rounded-xl" />
          <Sk className="h-4 w-64 rounded-full" />
        </div>
        <div className="flex gap-3">
          <SkKpiChip />
          <SkKpiChip />
        </div>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Sk className="h-11 flex-1 rounded-xl" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Sk key={i} className="h-11 w-24 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-4 py-2 px-4">
        {['w-1/3', 'w-1/4', 'w-1/6', 'w-1/6'].map((w, i) => (
          <Sk key={i} className={`h-3 ${w} rounded-full`} />
        ))}
      </div>

      {/* Submission rows */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkSubmissionRow key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for /teacher/codes
 */
export function TeacherCodesSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-6">
        <div className="flex flex-col gap-2">
          <Sk className="h-8 w-48 rounded-xl" />
          <Sk className="h-4 w-60 rounded-full" />
        </div>
        <SkKpiChip />
      </div>

      {/* Generator form card */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xs flex flex-col gap-4">
        <Sk className="h-6 w-40 rounded-lg" />
        <div className="flex flex-col sm:flex-row gap-3">
          <Sk className="flex-1 h-12 rounded-xl" />
          <Sk className="h-12 w-28 rounded-xl" />
          <Sk className="h-12 w-36 rounded-xl" />
        </div>
      </div>

      {/* Codes table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-xs overflow-hidden">
        {/* table header */}
        <div className="flex items-center gap-4 py-3 px-4 bg-[#F7F6F3] border-b border-black/5">
          {['w-1/3', 'w-1/4', 'w-1/6', 'w-1/6'].map((w, i) => (
            <Sk key={i} className={`h-3 ${w} rounded-full`} />
          ))}
        </div>
        {/* rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <SkCodeRow key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for /parent/dashboard
 */
export function ParentDashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 pb-8">
        <div className="flex flex-col gap-2">
          <Sk className="h-9 w-64 rounded-xl" />
          <Sk className="h-4 w-52 rounded-full" />
        </div>
        <div className="flex gap-3">
          <SkKpiChip />
          <SkKpiChip />
          <SkKpiChip />
        </div>
      </div>

      {/* Student identity card */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xs flex items-center gap-5">
        <Sk className="w-20 h-20 rounded-3xl shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Sk className="h-5 w-40 rounded-lg" />
          <Sk className="h-3 w-28 rounded-full" />
          <div className="flex gap-2 mt-1">
            <Sk className="h-6 w-20 rounded-full" />
            <Sk className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Progress bento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-black/5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Sk className="h-5 w-36 rounded-lg" />
              <Sk className="h-8 w-16 rounded-xl" />
            </div>
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Sk className="h-3 w-32 rounded-full" />
                  <Sk className="h-3 w-10 rounded-full" />
                </div>
                <Sk className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Contact card */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xs flex flex-col gap-3">
        <Sk className="h-5 w-40 rounded-lg" />
        <SkParagraph lines={2} />
        <Sk className="h-11 w-48 rounded-xl mt-2" />
      </div>
    </div>
  );
}

/**
 * Skeleton for /student/course/[id] classroom
 */
export function CourseClassroomSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      {/* Main video player area */}
      <div className="flex flex-col gap-5">
        {/* Video placeholder */}
        <Sk className="w-full aspect-video rounded-3xl" />

        {/* Video info */}
        <div className="flex flex-col gap-2">
          <Sk className="h-6 w-3/4 rounded-xl" />
          <div className="flex items-center gap-3">
            <Sk className="h-3 w-24 rounded-full" />
            <Sk className="h-3 w-20 rounded-full" />
          </div>
        </div>

        {/* Action bar */}
        <div className="flex gap-3">
          <Sk className="h-10 flex-1 rounded-xl" />
          <Sk className="h-10 w-10 rounded-xl" />
          <Sk className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      {/* Sidebar syllabus */}
      <div className="flex flex-col gap-4">
        {/* Course header */}
        <div className="bg-white rounded-3xl p-4 border border-black/5 shadow-xs flex flex-col gap-3">
          <Sk className="h-5 w-3/4 rounded-lg" />
          <div className="flex items-center gap-2">
            <Sk className="w-7 h-7 rounded-full" />
            <Sk className="h-3 w-28 rounded-full" />
          </div>
        </div>

        {/* Section headers + items */}
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-black/5 shadow-xs overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-black/5">
              <Sk className="h-4 w-4/5 rounded-lg" />
              <Sk className="h-5 w-8 rounded-full" />
            </div>
            <div className="p-2 flex flex-col gap-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <SkSyllabusItem key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Animated Entrance Wrapper ────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/**
 * Wraps loaded content with a stagger-in entrance animation.
 * Use this to wrap the real page content after skeleton is dismissed.
 *
 * @example
 * {isLoading ? <StudentDashboardSkeleton /> : <FadeInContent><YourContent /></FadeInContent>}
 */
export function FadeInContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animate a single child element in on mount.
 */
export function FadeInItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
