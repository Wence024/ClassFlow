/**
 * Component for managing class sessions.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Users, User, MapPin } from 'lucide-react';
import type { ClassSession } from '@/types/classSession';

type SessionCardProps = {
  session: ClassSession;
  onEdit: (session: ClassSession) => void;
  onDelete: (sessionId: string) => void;
  isDeleting?: boolean;
};

/**
 * Card displaying a single class session with management actions.
 */
export function SessionCard({ session, onEdit, onDelete, isDeleting = false }: SessionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {session.course?.name || 'Unknown Course'}
            </CardTitle>
            <CardDescription>
              {session.course?.code || 'N/A'} • {session.period_count} period(s)
            </CardDescription>
          </div>
          <Badge variant="secondary">{session.course?.units || 0} units</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{session.group?.name || 'Unknown Group'}</span>
            {session.group?.code && (
              <Badge variant="outline" className="text-xs">
                {session.group.code}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>
              {session.instructor
                ? `${session.instructor.first_name} ${session.instructor.last_name}`
                : 'Unknown Instructor'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{session.classroom?.name || 'No classroom assigned'}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onEdit(session)}>
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(session.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type SessionsListProps = {
  sessions: ClassSession[];
  onEdit: (session: ClassSession) => void;
  onDelete: (sessionId: string) => void;
  isDeleting?: boolean;
};

/**
 * List of session cards with management capabilities.
 */
export function SessionsList({ sessions, onEdit, onDelete, isDeleting = false }: SessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No class sessions found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
