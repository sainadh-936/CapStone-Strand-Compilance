"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { getSessions, deleteSession } from "@/lib/storage";
import type { Session } from "@/types";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>(() => getSessions());

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSession(id);
      setSessions(getSessions());
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Active Collection Sessions
          </h1>
          <p className="text-slate-400 mt-4 text-lg">
            Monitor and manage sample collection sessions
          </p>
        </div>
        <Link href="/session/new">
          <Button size="lg">+ New Session</Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            No sessions yet
          </h2>
          <p className="text-slate-400 mb-6">
            Create your first collection session to get started
          </p>
          <Link href="/session/new">
            <Button>Create Session</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-5">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={() => handleDelete(session.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({
  session,
  onDelete,
}: {
  session: Session;
  onDelete: () => void;
}) {
  const completedDocs = session.submissions.length;
  const totalDocs = session.requiredDocuments.length;
  const completionPercent =
    totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  // Determine next action based on status
  const getNextAction = () => {
    switch (session.status) {
      case "created":
        return {
          href: `/session/${session.id}/documents`,
          label: "Select Documents",
        };
      case "link_generated":
      case "in_progress":
      case "submitted":
        return { href: `/session/${session.id}/review`, label: "View Details" };
      default:
        return { href: `/session/${session.id}/documents`, label: "Continue" };
    }
  };

  const action = getNextAction();

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">
              {session.patientName}
            </h3>
            <Badge status={session.status} />
          </div>
          <p className="text-slate-400 text-sm mb-3">
            📱 {session.phoneNumber}
            {session.city && ` • 📍 ${session.city}`}
          </p>

          {totalDocs > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-400">Documentation</span>
                <span className="text-slate-300">
                  {completedDocs}/{totalDocs} complete
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500">
            Created{" "}
            {new Date(session.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-2 ml-4">
          <Link href={action.href}>
            <Button size="sm">{action.label}</Button>
          </Link>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            🗑️
          </Button>
        </div>
      </div>
    </Card>
  );
}
