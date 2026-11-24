"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, FileText, HelpCircle } from "lucide-react";

import { useDistinctStrataSubjects } from "@/lib/hooks/nexus/strata/learning/subjects/distinct/useDistinctStrataSubjects";
import DiyExamQuestionCreation from "@/app/dashboards/shared/modal/diyExamQuestionCreation";
import { useNominalStrataExams } from "@/lib/hooks/nexus/strata/assessment/learning/exams/nominal/useNominalStrataExams";

type Raw = {
    guidId?: string | null;
    id?: number | string;
    name?: string;
    description?: string | null;
    order?: unknown;
    questionsCount?: number | null;
};

export interface DistinctSubjectsCourse {
    guid: string;
    name: string;
}

interface SubjectNode {
    guid: string;
    name: string;
    description: string;
    order: number;
}

interface ExamStats {
    exams: number;
    questions: number;
}

const TINTS = [
    "bg-pink-100 border-pink-400",
    "bg-emerald-100 border-emerald-400",
    "bg-sky-100 border-sky-400",
    "bg-orange-100 border-orange-400",
];
const BTNS = ["bg-pink-400", "bg-emerald-400", "bg-sky-400", "bg-orange-400"];

const orderOf = (v: unknown) => {
    const n = parseInt(String(v ?? "").trim(), 10);
    return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
};

const truncate = (text: string, max = 90) =>
    !text ? "—" : text.length > max ? text.slice(0, max) + "…" : text;

// ── Headless loaders ──────────────────────────────────────────────────────────
function CourseSubjectsLoader({
    courseGuid,
    onLoaded,
}: {
    courseGuid: string;
    onLoaded: (key: string, list: SubjectNode[]) => void;
}) {
    const { filteredSubjects } = useDistinctStrataSubjects({
        parentIdentifier: courseGuid,
        page: 1,
        perPage: 96,
        sortColumn: null,
        sortDirection: "asc",
    });

    useEffect(() => {
        const list = ((filteredSubjects ?? []) as unknown as Raw[])
            .map((s) => ({
                guid: String(s.guidId ?? s.id ?? ""),
                name: s.name ?? "Untitled Subject",
                description: s.description ?? "",
                order: orderOf(s.order),
            }))
            .filter((s) => s.guid)
            .sort(
                (a, b) =>
                    a.order - b.order ||
                    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
            );
        onLoaded(courseGuid, list);
    }, [filteredSubjects, courseGuid, onLoaded]);

    return null;
}

function SubjectStatsLoader({
    subjectGuid,
    onLoaded,
}: {
    subjectGuid: string;
    onLoaded: (key: string, stats: ExamStats) => void;
}) {
    const { filteredExams } = useNominalStrataExams({
        parentIdentifier: subjectGuid,
        page: 1,
        perPage: 96,
        sortColumn: null,
        sortDirection: "asc",
        dynamicLearningStrataName: "subject",
    });

    useEffect(() => {
        const list = (filteredExams ?? []) as unknown as Raw[];
        onLoaded(subjectGuid, {
            exams: list.length,
            questions: list.reduce((sum, e) => sum + (e.questionsCount ?? 0), 0),
        });
    }, [filteredExams, subjectGuid, onLoaded]);

    return null;
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function DistinctSubjects({
    courses,
    selectedCourseGuid,
    targetPanel,
    targetName,
    targetSegment,
}: {
    courses: DistinctSubjectsCourse[];
    selectedCourseGuid: string | null;
    targetPanel: string;
    targetName: string;
    targetSegment: string;
}) {
    const [diySubject, setDiySubject] = useState<{ guid: string; name: string; courseName: string } | null>(null);
    const [subjectsByCourse, setSubjectsByCourse] = useState<Record<string, SubjectNode[]>>({});
    const [statsBySubject, setStatsBySubject] = useState<Record<string, ExamStats>>({});

    const reportSubjects = useCallback(
        (key: string, list: SubjectNode[]) =>
            setSubjectsByCourse((prev) =>
                JSON.stringify(prev[key]) === JSON.stringify(list) ? prev : { ...prev, [key]: list }
            ),
        []
    );

    const reportStats = useCallback(
        (key: string, stats: ExamStats) =>
            setStatsBySubject((prev) => {
                const old = prev[key];
                return old && old.exams === stats.exams && old.questions === stats.questions
                    ? prev
                    : { ...prev, [key]: stats };
            }),
        []
    );

    // Flatten, tagging each subject with its parent course
    const allSubjects = useMemo(
        () =>
            courses.flatMap((c) =>
                (subjectsByCourse[c.guid] ?? []).map((s) => ({
                    ...s,
                    courseGuid: c.guid,
                    courseName: c.name,
                }))
            ),
        [courses, subjectsByCourse]
    );

    const visibleSubjects = useMemo(
        () =>
            selectedCourseGuid
                ? allSubjects.filter((s) => s.courseGuid === selectedCourseGuid)
                : allSubjects,
        [allSubjects, selectedCourseGuid]
    );

    const selectedCourseName = courses.find((c) => c.guid === selectedCourseGuid)?.name;

    return (
        <section>
            {/* Headless loaders */}
            {courses.map((c) => (
                <CourseSubjectsLoader key={c.guid} courseGuid={c.guid} onLoaded={reportSubjects} />
            ))}
            {allSubjects.map((s) => (
                <SubjectStatsLoader key={s.guid} subjectGuid={s.guid} onLoaded={reportStats} />
            ))}

            <div className="mb-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-[var(--text-color)] opacity-70 shrink-0" />
                    <h2 className="truncate text-base md:text-lg font-bold text-[var(--text-color)]">
                        {selectedCourseName ? `${selectedCourseName} — Subjects` : "All Subjects"}
                    </h2>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[var(--text-color)] opacity-60">
                    {visibleSubjects.length} subject{visibleSubjects.length === 1 ? "" : "s"}
                </span>
            </div>

            {visibleSubjects.length === 0 ? (
                <p className="py-6 text-center text-sm text-[var(--text-color)] opacity-60">
                    No subjects available.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleSubjects.map((s, i) => {
                        const stats = statsBySubject[s.guid];
                        return (
                            <div
                                key={`${s.courseGuid}-${s.guid}`}
                                className={`flex flex-col rounded-2xl border p-3 text-slate-900 shadow ${TINTS[i % 4]}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow">
                                        <BookOpen className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <h6 className="truncate text-sm font-extrabold">{s.name}</h6>
                                        <small className="block truncate text-[10px] text-slate-500">{s.courseName}</small>
                                    </div>
                                </div>

                                <p className="my-2 line-clamp-2 text-[11px] text-slate-600">
                                    {truncate(s.description, 90)}
                                </p>

                                <div className="mb-2 flex gap-1.5 text-[10px] font-bold uppercase">
                                    <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800">
                                        <FileText className="h-3 w-3" />
                                        {stats ? stats.exams : "…"} exams
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">
                                        <HelpCircle className="h-3 w-3" />
                                        {stats ? stats.questions : "…"} Qs
                                    </span>
                                </div>

                                <div className="mt-auto flex gap-2">
                                    <Link
                                        href={`/dashboards/${targetPanel}/vista/learning/subjects/distinct/overview?identifier=${s.courseGuid}`}
                                        className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-center text-[11px] font-extrabold ${BTNS[i % 4]}`}
                                    >
                                        Study <ArrowRight className="h-3 w-3" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setDiySubject({ guid: s.guid, name: s.name, courseName: s.courseName })}
                                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-700 to-violet-700 py-1.5 text-[11px] font-extrabold text-white"
                                    >
                                        Custom Test
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <DiyExamQuestionCreation
                isOpen={!!diySubject}
                onClose={() => setDiySubject(null)}
                subjectGuid={diySubject?.guid ?? ""}
                subjectName={diySubject?.name ?? ""}
                courseName={diySubject?.courseName}
                targetName={targetName}
                targetPanel={targetPanel}
                targetSegment={targetSegment}
            />
        </section>
    );
}