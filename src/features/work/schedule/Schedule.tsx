import React, { useState } from 'react';
import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarItem,
  GanttSidebarGroup,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttToday,
  GanttMarker,
  type GanttFeature,
  type GanttStatus,
  type GanttMarkerProps,
} from '@/components/shadcn-io/gantt';

// 목업 데이터
const mockStatuses: GanttStatus[] = [
  { id: '96', name: '9 ~ 6', color: '#3b82f6' },
  { id: '85', name: '8 ~ 5', color: '#10b981' },
  { id: '107', name: '10 ~ 7', color: '#ef4444' },
];

const today = new Date();
const mockFeatures: GanttFeature[] = [
  {
    id: '이서준',
    name: '이서준',
    startAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
    endAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
    status: mockStatuses[0],
    // lane: 'team-meetings',
  },
  {
    id: '이민정',
    name: '이민정',
    startAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    endAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0),
    status: mockStatuses[2],
    // lane: 'development',
  },
  {
    id: '강동원',
    name: '강동원',
    startAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
    endAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0),
    status: mockStatuses[1],
    // lane: 'break',
  },
  {
    id: '심규선',
    name: '심규선',
    startAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
    endAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
    status: mockStatuses[0],
    // lane: 'development',
  },
];

const mockMarkers: GanttMarkerProps[] = [
  {
    id: 'work-start',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0),
    label: '업무 시작',
  },
  {
    id: 'lunch-time',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
    label: '점심시간',
  },
  {
    id: 'work-end',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0),
    label: '업무 종료',
  }
];

const Schedule: React.FC = () => {
  const [features, setFeatures] = useState<GanttFeature[]>(mockFeatures);
  const [markers, setMarkers] = useState<GanttMarkerProps[]>(mockMarkers);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const groupedFeatures = features.reduce((acc, feature) => {
    const lane = feature.lane || 'default';
    if (!acc[lane]) acc[lane] = [];
    acc[lane].push(feature);
    return acc;
  }, {} as Record<string, GanttFeature[]>);

  const handleFeatureMove = (id: string, startAt: Date, endAt: Date | null) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === id 
        ? { ...feature, startAt, endAt: endAt || feature.endAt }
        : feature
    ));
  };

  const handleAddItem = (date: Date) => {
    const newFeature: GanttFeature = {
      id: `new-task-${Date.now()}`,
      name: '새 작업',
      startAt: date,
      endAt: new Date(date.getTime() + 60 * 60 * 1000),
      status: mockStatuses[0],
      lane: 'development',
    };
    setFeatures(prev => [...prev, newFeature]);
  };

  const handleRemoveMarker = (id: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
  };

  return (
    // Layout 구조에 맞게 높이 계산: 100vh - 헤더 높이
    <div 
      className="flex flex-col w-full overflow-hidden"
      style={{
        height: 'calc(100vh - var(--header-height))', // 헤더 높이 제외
        maxHeight: 'calc(100vh - var(--header-height))',
      }}
    >
      {/* 페이지 헤더 */}
      <div className="flex-shrink-0 p-4 bg-muted/50 border-b">
        <h1 className="text-xl font-bold">시간별 Gantt Chart</h1>
        <p className="text-sm text-muted-foreground">
          {selectedDate.toLocaleDateString('ko-KR')} - 00:00 ~ 23:59
        </p>
      </div>
      
      {/* Gantt Chart 컨테이너 - 나머지 공간 모두 사용 */}
      <div className="flex-1 w-full overflow-hidden relative min-h-0">
        <GanttProvider 
          range="timely" 
          zoom={100}
          selectedDate={selectedDate}
          onAddItem={handleAddItem}
        >
          <GanttSidebar>
            {Object.entries(groupedFeatures).map(([lane, laneFeatures]) => (
              <GanttSidebarGroup key={lane} name={lane}>
                {laneFeatures.map(feature => (
                  <GanttSidebarItem
                    key={feature.id}
                    feature={feature}
                  />
                ))}
              </GanttSidebarGroup>
            ))}
          </GanttSidebar>

          <GanttTimeline>
            <GanttHeader />
            <GanttToday />
            
            {markers.map(marker => (
              <GanttMarker
                key={marker.id}
                {...marker}
                onRemove={handleRemoveMarker}
              />
            ))}
            
            <GanttFeatureList>
              <GanttFeatureListGroup>
                {Object.entries(groupedFeatures).map(([lane, laneFeatures]) => (
                  <GanttFeatureRow
                    key={lane}
                    features={laneFeatures}
                    onMove={handleFeatureMove}
                  >
                    {(feature) => (
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: feature.status.color }}
                        />
                        <span className="text-xs font-medium truncate flex-1">
                          {feature.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {feature.startAt.getHours().toString().padStart(2, '0')}:
                          {feature.startAt.getMinutes().toString().padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </GanttFeatureRow>
                ))}
              </GanttFeatureListGroup>
            </GanttFeatureList>
          </GanttTimeline>
        </GanttProvider>
      </div>
    </div>
  );
};

export default Schedule;
