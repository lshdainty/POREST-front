import {
  GanttProvider,
  GanttTimeline,
  GanttHeader,
  GanttSidebar,
  GanttFeatureList,
  GanttSidebarGroup,
  GanttFeature,
  GanttStatus,
  GanttFeatureRow,
} from '@/components/shadcn-io/gantt';
import groupBy from 'lodash.groupby';

// Mock Data
const statuses: GanttStatus[] = [
  { id: '1', name: 'Working', color: '#10B981' },
  { id: '2', name: 'On Vacation', color: '#F59E0B' },
  { id: '3', name: 'Sick Leave', color: '#EF4444' },
];

const users = [
  { id: 'user-1', name: 'John Doe' },
  { id: 'user-2', name: 'Jane Smith' },
  { id: 'user-3', name: 'Peter Jones' },
  { id: 'user-4', name: 'Mary Williams' },
];

const workSchedules: GanttFeature[] = [
  // John Doe
  {
    id: 'schedule-1',
    name: 'Morning Shift',
    startAt: new Date('2025-09-03T09:00:00'),
    endAt: new Date('2025-09-03T12:00:00'),
    status: statuses[0],
    lane: 'John Doe',
  },
  {
    id: 'schedule-2',
    name: 'Afternoon Shift',
    startAt: new Date('2025-09-03T13:00:00'),
    endAt: new Date('2025-09-03T18:00:00'),
    status: statuses[0],
    lane: 'John Doe',
  },
  {
    id: 'schedule-9',
    name: 'Morning Shift',
    startAt: new Date('2025-09-04T09:00:00'),
    endAt: new Date('2025-09-04T12:00:00'),
    status: statuses[0],
    lane: 'John Doe',
  },
  // Jane Smith
  {
    id: 'schedule-3',
    name: 'Full Day Shift',
    startAt: new Date('2025-09-03T09:00:00'),
    endAt: new Date('2025-09-03T17:00:00'),
    status: statuses[0],
    lane: 'Jane Smith',
  },
  {
    id: 'schedule-4',
    name: 'Vacation',
    startAt: new Date('2025-09-04T00:00:00'),
    endAt: new Date('2025-09-05T23:59:59'),
    status: statuses[1],
    lane: 'Jane Smith',
  },
  // Peter Jones
  {
    id: 'schedule-5',
    name: 'Morning Shift',
    startAt: new Date('2025-09-03T08:00:00'),
    endAt: new Date('2025-09-03T12:00:00'),
    status: statuses[0],
    lane: 'Peter Jones',
  },
  {
    id: 'schedule-6',
    name: 'Sick Leave',
    startAt: new Date('2025-09-04T00:00:00'),
    endAt: new Date('2025-09-04T23:59:59'),
    status: statuses[2],
    lane: 'Peter Jones',
  },
  // Mary Williams
  {
    id: 'schedule-7',
    name: 'Night Shift',
    startAt: new Date('2025-09-03T22:00:00'),
    endAt: new Date('2025-09-04T06:00:00'),
    status: statuses[0],
    lane: 'Mary Williams',
  },
  {
    id: 'schedule-8',
    name: 'Night Shift',
    startAt: new Date('2025-09-04T22:00:00'),
    endAt: new Date('2025-09-05T06:00:00'),
    status: statuses[0],
    lane: 'Mary Williams',
  },
];

export default function Schedule() {
  const groupedSchedules = groupBy(workSchedules, 'lane');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Work Schedule</h1>
      <GanttProvider range="daily" zoom={100}>
        <GanttSidebar>
          {users.map(user => (
            <GanttSidebarGroup key={user.id} name={user.name} />
          ))}
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            {users.map(user => (
              <GanttFeatureRow
                features={groupedSchedules[user.name] || []}
                key={user.id}
              />
            ))}
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    </div>
  );
}