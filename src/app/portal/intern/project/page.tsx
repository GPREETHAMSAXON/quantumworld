'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarDays, UploadCloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  EVIDENCE_CATEGORIES,
  EVIDENCE_LABELS,
  TASK_STATUSES,
  canWorkOnProject,
  getProjectExecution,
  saveMilestoneProgress,
  submitProgressUpdate,
  type EvidenceCategory,
  type ProjectExecutionState,
  type TaskStatus,
} from '@/lib/internship/projectExecution';

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ProjectExecutionPage() {
  const { user } = useAuth();
  const [state, setState] = useState<ProjectExecutionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingMilestone, setSavingMilestone] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('IN_PROGRESS');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState('');
  const [internUpdate, setInternUpdate] = useState('');
  const [category, setCategory] = useState<EvidenceCategory>('RESULTS');
  const [files, setFiles] = useState<File[]>([]);
  const version = useRef(0);
  const initializedUpdate = useRef<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const request = ++version.current;
    setLoading(true);
    setError(null);
    try {
      const next = await getProjectExecution(user.id);
      if (request !== version.current) return;
      setState(next);
      if (next.latestUpdate && initializedUpdate.current !== next.latestUpdate.id) {
        initializedUpdate.current = next.latestUpdate.id;
        setCurrentTask(next.latestUpdate.current_task);
        setTaskStatus(next.latestUpdate.task_status);
        setExpectedCompletionDate(next.latestUpdate.expected_completion_date || '');
        setInternUpdate(next.latestUpdate.intern_update || '');
      }
    } catch (err) {
      if (request === version.current)
        setError(err instanceof Error ? err.message : 'Unable to load the project workspace.');
    } finally {
      if (request === version.current) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
    return () => {
      version.current++;
    };
  }, [load]);

  async function updateMilestone(id: string, value: number) {
    if (!state?.internship || savingMilestone) return;
    const original = state.milestones.find((milestone) => milestone.id === id)?.progress_percent;
    if (original === value) return;
    setSavingMilestone(id);
    setError(null);
    setMessage(null);
    setState({
      ...state,
      milestones: state.milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, progress_percent: value } : milestone
      ),
      internship: {
        ...state.internship,
        overall_progress_percent: Math.round(
          state.milestones.reduce(
            (sum, milestone) => sum + (milestone.id === id ? value : milestone.progress_percent),
            0
          ) / state.milestones.length
        ),
      },
    });
    try {
      await saveMilestoneProgress(state.internship, id, value);
    } catch (err) {
      setState((current) =>
        current && original !== undefined
          ? {
              ...current,
              milestones: current.milestones.map((milestone) =>
                milestone.id === id ? { ...milestone, progress_percent: original } : milestone
              ),
            }
          : current
      );
      setError(err instanceof Error ? err.message : 'Could not save milestone progress.');
    } finally {
      setSavingMilestone(null);
    }
  }

  async function submit() {
    if (!state?.internship || submitting) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const update = await submitProgressUpdate(state.internship, {
        currentTask,
        taskStatus,
        expectedCompletionDate,
        internUpdate,
        category,
        files,
      });
      setState({ ...state, latestUpdate: update });
      setFiles([]);
      setMessage('Progress update submitted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit the progress update.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <p role="status" className="py-16 text-center text-sm text-gray-500">
        Loading project workspace...
      </p>
    );
  if (error && !state)
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        {error}
      </p>
    );
  if (
    !state?.internship ||
    ![
      'MENTOR_ASSIGNED',
      'PROJECT_ACTIVE',
      'PROGRESS_REVIEW',
      'FINAL_REPORT_SUBMITTED',
      'MENTOR_APPROVED',
      'ADMIN_APPROVED',
    ].includes(state.internship.status)
  )
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-lg font-semibold text-gray-900">Project workspace not available yet</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your workspace opens once a mentor has been assigned.
        </p>
      </div>
    );

  const { internship, mentor } = state;
  const editable = canWorkOnProject(internship.status);
  const projectTitle =
    internship.proposal_title || internship.specific_topic || 'Confirmed project';
  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-600">
              Project execution
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
              {projectTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Mentor: {mentor?.full_name || 'Assigned mentor'}
            </p>
          </div>
          <StatusBadge status={internship.status} />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <div className="flex items-end justify-between">
              <p className="text-sm font-medium text-gray-700">Overall Progress</p>
              <p className="text-lg font-semibold text-indigo-700">
                {internship.overall_progress_percent}%
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${internship.overall_progress_percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Calculated from milestone progress.</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Start Date</p>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(internship.project_started_at)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Expected Completion
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(internship.project_expected_completion_date)}
            </p>
          </div>
        </div>
      </header>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          {message}
        </p>
      )}{' '}
      {!editable && (
        <p className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          This project is in review, so milestones and progress updates are read-only.
        </p>
      )}
      <div className="grid items-start gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update each milestone to keep overall project progress accurate.
            </p>
          </div>
          <ul className="mt-5 space-y-4">
            {state.milestones.map((milestone) => (
              <li key={milestone.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor={`milestone-${milestone.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-gray-800"
                  >
                    <input
                      id={`milestone-${milestone.id}`}
                      type="checkbox"
                      checked={milestone.progress_percent === 100}
                      disabled={!editable || !!savingMilestone}
                      onChange={(event) =>
                        void updateMilestone(milestone.id, event.target.checked ? 100 : 0)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {milestone.label}
                  </label>
                  <span className="text-sm font-semibold text-indigo-700">
                    {milestone.progress_percent}%
                  </span>
                </div>
                <input
                  aria-label={`${milestone.label} progress`}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={milestone.progress_percent}
                  disabled={!editable || !!savingMilestone}
                  onChange={(event) =>
                    void updateMilestone(milestone.id, Number(event.target.value))
                  }
                  className="mt-3 w-full accent-indigo-600 disabled:opacity-50"
                />
              </li>
            ))}
          </ul>
          {!state.milestones.length && (
            <p className="mt-5 text-sm text-gray-500">
              Milestones are being prepared for this project.
            </p>
          )}
        </section>
        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Progress Update</h2>
          <p className="mt-1 text-sm text-gray-500">
            Share your current work and supporting evidence.
          </p>
          <fieldset disabled={!editable || submitting} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="current-task"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Current Task
              </label>
              <input
                id="current-task"
                value={currentTask}
                onChange={(event) => setCurrentTask(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>
            <div>
              <label
                htmlFor="task-status"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="task-status"
                value={taskStatus}
                onChange={(event) => setTaskStatus(event.target.value as TaskStatus)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="expected-completion"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Expected Completion
              </label>
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  id="expected-completion"
                  type="date"
                  value={expectedCompletionDate}
                  onChange={(event) => setExpectedCompletionDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="intern-update"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Intern Update
              </label>
              <textarea
                id="intern-update"
                rows={4}
                value={internUpdate}
                onChange={(event) => setInternUpdate(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>
            <div>
              <label
                htmlFor="evidence-category"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Evidence Type
              </label>
              <select
                id="evidence-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as EvidenceCategory)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400"
              >
                {EVIDENCE_CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {EVIDENCE_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-5 text-center hover:border-indigo-300">
              <UploadCloud size={25} className="text-indigo-500" />
              <span className="text-sm text-gray-700">Upload Evidence</span>
              <span className="text-xs text-gray-500">
                Research Paper, Code, Dataset, Results, or Screenshots · up to 10 files
              </span>
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => {
                  setFiles(Array.from(event.target.files || []));
                  event.target.value = '';
                }}
              />
            </label>
            {files.length > 0 && (
              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                <p className="font-medium text-gray-700">
                  {files.length} file{files.length === 1 ? '' : 's'} selected
                </p>
                <ul className="mt-1 max-h-24 space-y-1 overflow-y-auto">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="break-all">
                      {file.name}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setFiles([])} className="mt-2 text-indigo-600">
                  Clear files
                </button>
              </div>
            )}
          </fieldset>
          <button
            type="button"
            disabled={!editable || submitting}
            onClick={() => void submit()}
            className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Progress Update'}
          </button>
        </aside>
      </div>
    </div>
  );
}
