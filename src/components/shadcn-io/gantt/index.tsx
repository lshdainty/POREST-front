"use client";
import {
  DndContext,
  MouseSensor,
  useDraggable,
  useSensor,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useMouse, useThrottle, useWindowScroll } from "@uidotdev/usehooks";
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  endOfDay,
  endOfMonth,
  format,
  formatDate,
  formatDistance,
  getDate,
  getDaysInMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { atom, useAtom } from "jotai";
import throttle from "lodash.throttle";
import { PlusIcon, TrashIcon } from "lucide-react";
import type {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Card } from "@/components/shadcn/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/shadcn/contextMenu";
import { cn } from "@/lib/utils";

const draggingAtom = atom(false);
const scrollXAtom = atom(0);
export const useGanttDragging = () => useAtom(draggingAtom);
export const useGanttScrollX = () => useAtom(scrollXAtom);

export type GanttStatus = {
  id: string;
  name: string;
  color: string;
};

export type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: GanttStatus;
  lane?: string;
};

export type GanttMarkerProps = {
  id: string;
  date: Date;
  label: string;
};

export type Range = "daily" | "monthly" | "quarterly" | "timely";

// 시간별 전용 타입 정의
export type TimelyData = {
  date: Date;
  hours: number[];
};

export type TimelineData = {
  year: number;
  quarters: {
    months: {
      days: number;
    }[];
  }[];
}[];

export type GanttContextProps = {
  zoom: number;
  range: Range;
  columnWidth: number;
  sidebarWidth: number;
  headerHeight: number;
  rowHeight: number;
  onAddItem: ((date: Date) => void) | undefined;
  placeholderLength: number;
  timelineData: TimelineData;
  timelyData?: TimelyData; // 시간별 데이터 추가
  ref: RefObject<HTMLDivElement | null> | null;
  scrollToFeature?: (feature: GanttFeature) => void;
};

// 시간별 전용 함수들
const getTimelyOffset = (date: Date, baseDate: Date, columnWidth: number) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return (hour + minutes / 60) * columnWidth;
};

const getTimelyWidth = (startAt: Date, endAt: Date, columnWidth: number) => {
  const startHour = startAt.getHours() + startAt.getMinutes() / 60;
  const endHour = endAt.getHours() + endAt.getMinutes() / 60;
  return Math.max((endHour - startHour) * columnWidth, columnWidth * 0.5); // 최소 30분
};

const getTimelyDateByMousePosition = (mouseX: number, baseDate: Date, columnWidth: number) => {
  const hour = Math.floor(mouseX / columnWidth);
  const minutes = Math.round(((mouseX % columnWidth) / columnWidth) * 60);
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    Math.min(23, Math.max(0, hour)),
    Math.min(59, Math.max(0, minutes))
  );
};

// 기존 함수들 (daily, monthly, quarterly 용)
const getsDaysIn = (range: Range) => {
  let fn = (_date: Date) => 1;
  if (range === "monthly" || range === "quarterly") {
    fn = getDaysInMonth;
  }
  return fn;
};

const getDifferenceIn = (range: Range) => {
  let fn = differenceInDays;
  if (range === "monthly" || range === "quarterly") {
    fn = differenceInMonths;
  }
  return fn;
};

const getInnerDifferenceIn = (range: Range) => {
  let fn = differenceInHours;
  if (range === "monthly" || range === "quarterly") {
    fn = differenceInDays;
  }
  return fn;
};

const getStartOf = (range: Range) => {
  let fn = startOfDay;
  if (range === "monthly" || range === "quarterly") {
    fn = startOfMonth;
  }
  return fn;
};

const getEndOf = (range: Range) => {
  let fn = endOfDay;
  if (range === "monthly" || range === "quarterly") {
    fn = endOfMonth;
  }
  return fn;
};

const getAddRange = (range: Range) => {
  let fn = addDays;
  if (range === "monthly" || range === "quarterly") {
    fn = addMonths;
  }
  return fn;
};

const getDateByMousePosition = (context: GanttContextProps, mouseX: number) => {
  // 시간별 모드일 때는 별도 처리
  if (context.range === "timely" && context.timelyData) {
    return getTimelyDateByMousePosition(mouseX, context.timelyData.date, (context.columnWidth * context.zoom) / 100);
  }

  const timelineStartDate = new Date(context.timelineData[0].year, 0, 1);
  const columnWidth = (context.columnWidth * context.zoom) / 100;
  const offset = Math.floor(mouseX / columnWidth);
  const daysIn = getsDaysIn(context.range);
  const addRange = getAddRange(context.range);
  const month = addRange(timelineStartDate, offset);
  const daysInMonth = daysIn(month);
  const pixelsPerDay = Math.round(columnWidth / daysInMonth);
  const dayOffset = Math.floor((mouseX % columnWidth) / pixelsPerDay);
  const actualDate = addDays(month, dayOffset);
  return actualDate;
};

const createInitialTimelineData = (today: Date) => {
  const data: TimelineData = [];
  data.push(
    { year: today.getFullYear() - 1, quarters: new Array(4).fill(null) },
    { year: today.getFullYear(), quarters: new Array(4).fill(null) },
    { year: today.getFullYear() + 1, quarters: new Array(4).fill(null) }
  );

  for (const yearObj of data) {
    yearObj.quarters = new Array(4).fill(null).map((_, quarterIndex) => ({
      months: new Array(3).fill(null).map((_, monthIndex) => {
        const month = quarterIndex * 3 + monthIndex;
        return {
          days: getDaysInMonth(new Date(yearObj.year, month, 1)),
        };
      }),
    }));
  }
  return data;
};

// 시간별 데이터 생성 함수
const createTimelyData = (date: Date): TimelyData => {
  return {
    date,
    hours: Array.from({ length: 24 }, (_, i) => i),
  };
};

const getOffset = (date: Date, timelineStartDate: Date, context: GanttContextProps) => {
  // 시간별 모드일 때는 별도 처리
  if (context.range === "timely" && context.timelyData) {
    return getTimelyOffset(date, context.timelyData.date, (context.columnWidth * context.zoom) / 100);
  }

  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
  const differenceIn = getDifferenceIn(context.range);
  const startOf = getStartOf(context.range);
  const fullColumns = differenceIn(startOf(date), timelineStartDate);

  if (context.range === "daily") {
    return parsedColumnWidth * fullColumns;
  }

  const partialColumns = date.getDate();
  const daysInMonth = getDaysInMonth(date);
  const pixelsPerDay = parsedColumnWidth / daysInMonth;
  return fullColumns * parsedColumnWidth + partialColumns * pixelsPerDay;
};

const getWidth = (startAt: Date, endAt: Date | null, context: GanttContextProps) => {
  // 시간별 모드일 때는 별도 처리
  if (context.range === "timely") {
    if (!endAt) {
      return (context.columnWidth * context.zoom) / 100; // 1시간 기본
    }
    return getTimelyWidth(startAt, endAt, (context.columnWidth * context.zoom) / 100);
  }

  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
  if (!endAt) {
    return parsedColumnWidth * 2;
  }

  const differenceIn = getDifferenceIn(context.range);
  if (context.range === "daily") {
    const delta = differenceIn(endAt, startAt);
    return parsedColumnWidth * (delta ? delta : 1);
  }

  const daysInStartMonth = getDaysInMonth(startAt);
  const pixelsPerDayInStartMonth = parsedColumnWidth / daysInStartMonth;

  if (isSameDay(startAt, endAt)) {
    return pixelsPerDayInStartMonth;
  }

  const innerDifferenceIn = getInnerDifferenceIn(context.range);
  const startOf = getStartOf(context.range);

  if (isSameDay(startOf(startAt), startOf(endAt))) {
    return innerDifferenceIn(endAt, startAt) * pixelsPerDayInStartMonth;
  }

  const startRangeOffset = daysInStartMonth - getDate(startAt);
  const endRangeOffset = getDate(endAt);
  const fullRangeOffset = differenceIn(startOf(endAt), startOf(startAt));
  const daysInEndMonth = getDaysInMonth(endAt);
  const pixelsPerDayInEndMonth = parsedColumnWidth / daysInEndMonth;

  return (
    (fullRangeOffset - 1) * parsedColumnWidth +
    startRangeOffset * pixelsPerDayInStartMonth +
    endRangeOffset * pixelsPerDayInEndMonth
  );
};

const GanttContext = createContext<GanttContextProps>({
  zoom: 100,
  range: "monthly",
  columnWidth: 50,
  headerHeight: 60,
  sidebarWidth: 300,
  rowHeight: 36,
  onAddItem: undefined,
  placeholderLength: 2,
  timelineData: [],
  ref: null,
  scrollToFeature: undefined,
});

// 시간별 헤더 컴포넌트
const TimelyHeader: FC = () => {
  const gantt = useContext(GanttContext);
  const id = useId();

  if (!gantt.timelyData) return null;

  return (
    <div className="relative flex flex-col">
      <div
        className="sticky top-0 z-20 grid w-full shrink-0 bg-backdrop/90 backdrop-blur-sm"
        style={{ height: "var(--gantt-header-height)" }}
      >
        <div>
          <div
            className="sticky inline-flex whitespace-nowrap px-3 py-2 text-muted-foreground text-xs"
            style={{
              left: "var(--gantt-sidebar-width)",
            }}
          >
            <p>{format(gantt.timelyData.date, "yyyy년 MM월 dd일")}</p>
          </div>
        </div>
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(24, var(--gantt-column-width))`,
          }}
        >
          {gantt.timelyData.hours.map((hour) => (
            <div
              className="shrink-0 border-border/50 border-b py-1 text-center text-xs"
              key={`${id}-${hour}`}
            >
              <div className="flex flex-col items-center justify-center">
                <p className="font-medium">{hour.toString().padStart(2, '0')}</p>
                <p className="text-muted-foreground text-xs">00</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="grid h-full w-full divide-x divide-border/50"
        style={{
          gridTemplateColumns: `repeat(24, var(--gantt-column-width))`,
        }}
      >
        {gantt.timelyData.hours.map((hour) => (
          <div
            key={`${id}-col-${hour}`}
            className={cn(
              "group relative h-full overflow-hidden",
              hour < 9 || hour >= 18 ? "bg-secondary" : "" // 업무시간 외 구분
            )}
          />
        ))}
      </div>
    </div>
  );
};

export type GanttContentHeaderProps = {
  renderHeaderItem: (index: number) => ReactNode;
  title: string;
  columns: number;
};

export const GanttContentHeader: FC<GanttContentHeaderProps> = ({
  title,
  columns,
  renderHeaderItem,
}) => {
  const id = useId();
  return (
    <div
      className="sticky top-0 z-20 grid w-full shrink-0 bg-backdrop/90 backdrop-blur-sm"
      style={{ height: "var(--gantt-header-height)" }}
    >
      <div>
        <div
          className="sticky inline-flex whitespace-nowrap px-3 py-2 text-muted-foreground text-xs"
          style={{
            left: "var(--gantt-sidebar-width)",
          }}
        >
          <p>{title}</p>
        </div>
      </div>
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div
            className="shrink-0 border-border/50 border-b py-1 text-center text-xs"
            key={`${id}-${index}`}
          >
            {renderHeaderItem(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyHeader: FC = () => {
  const gantt = useContext(GanttContext);
  return gantt.timelineData.map((year) =>
    year.quarters
      .flatMap((quarter) => quarter.months)
      .map((month, index) => (
        <div className="relative flex flex-col" key={`${year.year}-${index}`}>
          <GanttContentHeader
            columns={month.days}
            renderHeaderItem={(item: number) => (
              <div className="flex items-center justify-center gap-1">
                <p>
                  {format(addDays(new Date(year.year, index, 1), item), "d")}
                </p>
                <p className="text-muted-foreground">
                  {format(
                    addDays(new Date(year.year, index, 1), item),
                    "EEEEE"
                  )}
                </p>
              </div>
            )}
            title={format(new Date(year.year, index, 1), "MMMM yyyy")}
          />
          <GanttColumns
            columns={month.days}
            isColumnSecondary={(item: number) =>
              [0, 6].includes(
                addDays(new Date(year.year, index, 1), item).getDay()
              )
            }
          />
        </div>
      ))
  );
};

const MonthlyHeader: FC = () => {
  const gantt = useContext(GanttContext);
  return gantt.timelineData.map((year) => (
    <div className="relative flex flex-col" key={year.year}>
      <GanttContentHeader
        columns={year.quarters.flatMap((quarter) => quarter.months).length}
        renderHeaderItem={(item: number) => (
          <p>{format(new Date(year.year, item, 1), "MMM")}</p>
        )}
        title={`${year.year}`}
      />
      <GanttColumns
        columns={year.quarters.flatMap((quarter) => quarter.months).length}
      />
    </div>
  ));
};

const QuarterlyHeader: FC = () => {
  const gantt = useContext(GanttContext);
  return gantt.timelineData.map((year) =>
    year.quarters.map((quarter, quarterIndex) => (
      <div
        className="relative flex flex-col"
        key={`${year.year}-${quarterIndex}`}
      >
        <GanttContentHeader
          columns={quarter.months.length}
          renderHeaderItem={(item: number) => (
            <p>
              {format(new Date(year.year, quarterIndex * 3 + item, 1), "MMM")}
            </p>
          )}
          title={`Q${quarterIndex + 1} ${year.year}`}
        />
        <GanttColumns columns={quarter.months.length} />
      </div>
    ))
  );
};

const headers: Record<Range, FC> = {
  daily: DailyHeader,
  monthly: MonthlyHeader,
  quarterly: QuarterlyHeader,
  timely: TimelyHeader,
};

export type GanttHeaderProps = {
  className?: string;
};

export const GanttHeader: FC<GanttHeaderProps> = ({ className }) => {
  const gantt = useContext(GanttContext);
  const Header = headers[gantt.range];
  return (
    <div
      className={cn(
        "-space-x-px flex h-full divide-x divide-border/50",
        className
      )}
      style={{
        width: '100%',
      }}
    >
      <Header />
    </div>
  );
};

export type GanttSidebarItemProps = {
  feature: GanttFeature;
  onSelectItem?: (id: string) => void;
  className?: string;
};

export const GanttSidebarItem: FC<GanttSidebarItemProps> = ({
  feature,
  onSelectItem,
  className,
}) => {
  const gantt = useContext(GanttContext);
  const tempEndAt =
    feature.endAt && isSameDay(feature.startAt, feature.endAt)
      ? addDays(feature.endAt, 1)
      : feature.endAt;
  
  // 시간별 모드일 때는 시간으로 표시
  const duration = gantt.range === "timely" 
    ? `${feature.startAt.getHours().toString().padStart(2, '0')}:${feature.startAt.getMinutes().toString().padStart(2, '0')} - ${feature.endAt.getHours().toString().padStart(2, '0')}:${feature.endAt.getMinutes().toString().padStart(2, '0')}`
    : tempEndAt
    ? formatDistance(feature.startAt, tempEndAt)
    : `${formatDistance(feature.startAt, new Date())} so far`;

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      gantt.scrollToFeature?.(feature);
      onSelectItem?.(feature.id);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter") {
      gantt.scrollToFeature?.(feature);
      onSelectItem?.(feature.id);
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-2.5 p-2.5 text-xs hover:bg-secondary",
        className
      )}
      key={feature.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      style={{
        height: "var(--gantt-row-height)",
      }}
      tabIndex={0}
    >
      <div
        className="pointer-events-none h-2 w-2 shrink-0 rounded-full"
        style={{
          backgroundColor: feature.status.color,
        }}
      />
      <p className="pointer-events-none flex-1 truncate text-left font-medium">
        {feature.name}
      </p>
      <p className="pointer-events-none text-muted-foreground">{duration}</p>
    </div>
  );
};

export const GanttSidebarHeader: FC = () => (
  <div
    className="sticky top-0 z-10 flex shrink-0 items-end justify-between gap-2.5 border-border/50 border-b bg-backdrop/90 p-2.5 font-medium text-muted-foreground text-xs backdrop-blur-sm"
    style={{ height: "var(--gantt-header-height)" }}
  >
    <p className="flex-1 truncate text-left">작업</p>
    <p className="shrink-0">시간</p>
  </div>
);

export type GanttSidebarGroupProps = {
  children: ReactNode;
  name: string;
  className?: string;
};

export const GanttSidebarGroup: FC<GanttSidebarGroupProps> = ({
  children,
  name,
  className,
}) => (
  <div className={className}>
    <p
      className="w-full truncate p-2.5 text-left font-medium text-muted-foreground text-xs"
      style={{ height: "var(--gantt-row-height)" }}
    >
      {name}
    </p>
    <div className="divide-y divide-border/50">{children}</div>
  </div>
);

export type GanttSidebarProps = {
  children: ReactNode;
  className?: string;
};

export const GanttSidebar: FC<GanttSidebarProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      "sticky left-0 z-30 h-full overflow-y-auto overflow-x-hidden border-border/50 border-r bg-background/90 backdrop-blur-md",
      className
    )}
    data-roadmap-ui="gantt-sidebar"
    style={{
      width: 'var(--gantt-sidebar-width)',
      minWidth: 'var(--gantt-sidebar-width)',
      maxWidth: 'var(--gantt-sidebar-width)',
    }}
  >
    <GanttSidebarHeader />
    <div className="space-y-4">{children}</div>
  </div>
);

export type GanttAddFeatureHelperProps = {
  top: number;
  className?: string;
};

export const GanttAddFeatureHelper: FC<GanttAddFeatureHelperProps> = ({
  top,
  className,
}) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();

  const handleClick = () => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x = mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const currentDate = getDateByMousePosition(gantt, x);
    gantt.onAddItem?.(currentDate);
  };

  return (
    <div
      className={cn("absolute top-0 w-full px-0.5", className)}
      ref={mouseRef}
      style={{
        marginTop: -gantt.rowHeight / 2,
        transform: `translateY(${top}px)`,
      }}
    >
      <button
        className="flex h-full w-full items-center justify-center rounded-md border border-dashed p-2"
        onClick={handleClick}
        type="button"
      >
        <PlusIcon
          className="pointer-events-none select-none text-muted-foreground"
          size={16}
        />
      </button>
    </div>
  );
};

export type GanttColumnProps = {
  index: number;
  isColumnSecondary?: (item: number) => boolean;
};

export const GanttColumn: FC<GanttColumnProps> = ({
  index,
  isColumnSecondary,
}) => {
  const gantt = useContext(GanttContext);
  const [dragging] = useGanttDragging();
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();
  const [hovering, setHovering] = useState(false);
  const [windowScroll] = useWindowScroll();

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  const top = useThrottle(
    mousePosition.y -
      (mouseRef.current?.getBoundingClientRect().y ?? 0) -
      (windowScroll.y ?? 0),
    10
  );

  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden",
        isColumnSecondary?.(index) ? "bg-secondary" : ""
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={mouseRef}
    >
      {!dragging && hovering && gantt.onAddItem ? (
        <GanttAddFeatureHelper top={top} />
      ) : null}
    </div>
  );
};

export type GanttColumnsProps = {
  columns: number;
  isColumnSecondary?: (item: number) => boolean;
};

export const GanttColumns: FC<GanttColumnsProps> = ({
  columns,
  isColumnSecondary,
}) => {
  const id = useId();
  return (
    <div
      className="divide grid h-full w-full divide-x divide-border/50"
      style={{
        gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <GanttColumn
          index={index}
          isColumnSecondary={isColumnSecondary}
          key={`${id}-${index}`}
        />
      ))}
    </div>
  );
};

export type GanttFeatureDragHelperProps = {
  featureId: GanttFeature["id"];
  direction: "left" | "right";
  date: Date | null;
};

export const GanttFeatureDragHelper: FC<GanttFeatureDragHelperProps> = ({
  direction,
  featureId,
  date,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `feature-drag-helper-${featureId}`,
  });
  const isPressed = Boolean(attributes["aria-pressed"]);

  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);

  return (
    <div
      className={cn(
        "group -translate-y-1/2 !cursor-col-resize absolute top-1/2 z-[3] h-full w-6 rounded-md outline-none",
        direction === "left" ? "-left-2.5" : "-right-2.5"
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          "-translate-y-1/2 absolute top-1/2 h-[80%] w-1 rounded-sm bg-muted-foreground opacity-0 transition-all",
          direction === "left" ? "left-2.5" : "right-2.5",
          direction === "left" ? "group-hover:left-0" : "group-hover:right-0",
          isPressed && (direction === "left" ? "left-0" : "right-0"),
          "group-hover:opacity-100",
          isPressed && "opacity-100"
        )}
      />
      {date && (
        <div
          className={cn(
            "-translate-x-1/2 absolute top-10 hidden whitespace-nowrap rounded-lg border border-border/50 bg-background/90 px-2 py-1 text-foreground text-xs backdrop-blur-lg group-hover:block",
            isPressed && "block"
          )}
        >
          {format(date, "HH:mm")}
        </div>
      )}
    </div>
  );
};

export type GanttFeatureItemCardProps = Pick<GanttFeature, "id"> & {
  children?: ReactNode;
};

export const GanttFeatureItemCard: FC<GanttFeatureItemCardProps> = ({
  id,
  children,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const isPressed = Boolean(attributes["aria-pressed"]);

  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);

  return (
    <Card className="h-full w-full rounded-md bg-background p-2 text-xs shadow-sm">
      <div
        className={cn(
          "flex h-full w-full items-center justify-between gap-2 text-left",
          isPressed && "cursor-grabbing"
        )}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
      >
        {children}
      </div>
    </Card>
  );
};

export type GanttFeatureItemProps = GanttFeature & {
  onMove?: (id: string, startDate: Date, endDate: Date | null) => void;
  children?: ReactNode;
  className?: string;
};

export const GanttFeatureItem: FC<GanttFeatureItemProps> = ({
  onMove,
  children,
  className,
  ...feature
}) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  
  const timelineStartDate = useMemo(() => {
    if (gantt.range === "timely" && gantt.timelyData) {
      return gantt.timelyData.date;
    }
    return new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1);
  }, [gantt.timelineData, gantt.timelyData, gantt.range]);

  const [startAt, setStartAt] = useState<Date>(feature.startAt);
  const [endAt, setEndAt] = useState<Date | null>(feature.endAt);

  const width = useMemo(
    () => getWidth(startAt, endAt, gantt),
    [startAt, endAt, gantt]
  );
  
  const offset = useMemo(
    () => getOffset(startAt, timelineStartDate, gantt),
    [startAt, timelineStartDate, gantt]
  );

  const [mousePosition] = useMouse<HTMLDivElement>();
  const [previousMouseX, setPreviousMouseX] = useState(0);
  const [previousStartAt, setPreviousStartAt] = useState(startAt);
  const [previousEndAt, setPreviousEndAt] = useState(endAt);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const handleItemDragStart = useCallback(() => {
    setPreviousMouseX(mousePosition.x);
    setPreviousStartAt(startAt);
    setPreviousEndAt(endAt);
  }, [mousePosition.x, startAt, endAt]);

  const handleItemDragMove = useCallback(() => {
    if (gantt.range === "timely" && gantt.timelyData) {
      const currentDate = getTimelyDateByMousePosition(mousePosition.x, gantt.timelyData.date, (gantt.columnWidth * gantt.zoom) / 100);
      const originalDate = getTimelyDateByMousePosition(previousMouseX, gantt.timelyData.date, (gantt.columnWidth * gantt.zoom) / 100);
      const deltaMinutes = (currentDate.getTime() - originalDate.getTime()) / (1000 * 60);
      
      const newStartDate = new Date(previousStartAt.getTime() + deltaMinutes * 60 * 1000);
      const newEndDate = previousEndAt ? new Date(previousEndAt.getTime() + deltaMinutes * 60 * 1000) : null;
      
      setStartAt(newStartDate);
      setEndAt(newEndDate);
    } else {
      const currentDate = getDateByMousePosition(gantt, mousePosition.x);
      const originalDate = getDateByMousePosition(gantt, previousMouseX);
      const delta = differenceInDays(currentDate, originalDate);
      
      const newStartDate = addDays(previousStartAt, delta);
      const newEndDate = previousEndAt ? addDays(previousEndAt, delta) : null;
      
      setStartAt(newStartDate);
      setEndAt(newEndDate);
    }
  }, [gantt, mousePosition.x, previousMouseX, previousStartAt, previousEndAt]);

  const onDragEnd = useCallback(
    () => onMove?.(feature.id, startAt, endAt),
    [onMove, feature.id, startAt, endAt]
  );

  const handleLeftDragMove = useCallback(() => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x = mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const newStartAt = getDateByMousePosition(gantt, x);
    setStartAt(newStartAt);
  }, [gantt, mousePosition.x, scrollX]);

  const handleRightDragMove = useCallback(() => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x = mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const newEndAt = getDateByMousePosition(gantt, x);
    setEndAt(newEndAt);
  }, [gantt, mousePosition.x, scrollX]);

  return (
    <div
      className={cn("relative flex py-0.5", className)}
      style={{ 
        height: "var(--gantt-row-height)",
        width: '100%',
      }}
    >
      <div
        className="pointer-events-auto absolute top-0.5"
        style={{
          height: "calc(var(--gantt-row-height) - 4px)",
          width: Math.round(width),
          left: Math.round(offset),
        }}
      >
        {onMove && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleLeftDragMove}
            sensors={[mouseSensor]}
          >
            <GanttFeatureDragHelper
              date={startAt}
              direction="left"
              featureId={feature.id}
            />
          </DndContext>
        )}

        <DndContext
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={onDragEnd}
          onDragMove={handleItemDragMove}
          onDragStart={handleItemDragStart}
          sensors={[mouseSensor]}
        >
          <GanttFeatureItemCard id={feature.id}>
            {children ?? (
              <p className="flex-1 truncate text-xs">{feature.name}</p>
            )}
          </GanttFeatureItemCard>
        </DndContext>

        {onMove && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleRightDragMove}
            sensors={[mouseSensor]}
          >
            <GanttFeatureDragHelper
              date={endAt ?? new Date(startAt.getTime() + 60 * 60 * 1000)}
              direction="right"
              featureId={feature.id}
            />
          </DndContext>
        )}
      </div>
    </div>
  );
};

export type GanttFeatureListGroupProps = {
  children: ReactNode;
  className?: string;
};

export const GanttFeatureListGroup: FC<GanttFeatureListGroupProps> = ({
  children,
  className,
}) => (
  <div className={className} style={{ paddingTop: "var(--gantt-row-height)" }}>
    {children}
  </div>
);

export type GanttFeatureRowProps = {
  features: GanttFeature[];
  onMove?: (id: string, startAt: Date, endAt: Date | null) => void;
  children?: (feature: GanttFeature) => ReactNode;
  className?: string;
};

export const GanttFeatureRow: FC<GanttFeatureRowProps> = ({
  features,
  onMove,
  children,
  className,
}) => {
  const sortedFeatures = [...features].sort(
    (a, b) => a.startAt.getTime() - b.startAt.getTime()
  );

  const featureWithPositions = [];
  const subRowEndTimes: Date[] = [];

  for (const feature of sortedFeatures) {
    let subRow = 0;
    while (
      subRow < subRowEndTimes.length &&
      subRowEndTimes[subRow] > feature.startAt
    ) {
      subRow++;
    }

    if (subRow === subRowEndTimes.length) {
      subRowEndTimes.push(feature.endAt);
    } else {
      subRowEndTimes[subRow] = feature.endAt;
    }

    featureWithPositions.push({ ...feature, subRow });
  }

  const maxSubRows = Math.max(1, subRowEndTimes.length);
  const subRowHeight = 36;

  return (
    <div
      className={cn("relative", className)}
      style={{
        height: `${maxSubRows * subRowHeight}px`,
        minHeight: "var(--gantt-row-height)",
      }}
    >
      {featureWithPositions.map((feature) => (
        <div
          className="absolute w-full"
          key={feature.id}
          style={{
            top: `${feature.subRow * subRowHeight}px`,
            height: `${subRowHeight}px`,
          }}
        >
          <GanttFeatureItem {...feature} onMove={onMove}>
            {children ? (
              children(feature)
            ) : (
              <p className="flex-1 truncate text-xs">{feature.name}</p>
            )}
          </GanttFeatureItem>
        </div>
      ))}
    </div>
  );
};

export type GanttFeatureListProps = {
  className?: string;
  children: ReactNode;
};

export const GanttFeatureList: FC<GanttFeatureListProps> = ({
  className,
  children,
}) => (
  <div
    className={cn("absolute top-0 left-0 h-full space-y-4", className)}
    style={{ 
      marginTop: "var(--gantt-header-height)",
      width: '100%',
    }}
  >
    {children}
  </div>
);

export const GanttMarker: FC<
  GanttMarkerProps & {
    onRemove?: (id: string) => void;
    className?: string;
  }
> = memo(({ label, date, id, onRemove, className }) => {
  const gantt = useContext(GanttContext);
  
  const offset = useMemo(() => {
    if (gantt.range === "timely" && gantt.timelyData) {
      return getTimelyOffset(date, gantt.timelyData.date, (gantt.columnWidth * gantt.zoom) / 100);
    }
    const differenceIn = getDifferenceIn(gantt.range);
    const timelineStartDate = new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1);
    return differenceIn(date, timelineStartDate);
  }, [gantt, date]);

  const handleRemove = useCallback(() => onRemove?.(id), [onRemove, id]);

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: gantt.range === "timely" 
          ? `translateX(${offset}px)`
          : `translateX(calc(var(--gantt-column-width) * ${offset}))`,
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-card px-2 py-1 text-foreground text-xs",
              className
            )}
          >
            {label}
            <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
              {gantt.range === "timely" 
                ? format(date, "HH:mm")
                : formatDate(date, "MMM dd, yyyy")
              }
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {onRemove ? (
            <ContextMenuItem
              className="flex items-center gap-2 text-destructive"
              onClick={handleRemove}
            >
              <TrashIcon size={16} />
              Remove marker
            </ContextMenuItem>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
      <div className={cn("h-full w-px bg-card", className)} />
    </div>
  );
});

GanttMarker.displayName = "GanttMarker";

export type GanttProviderProps = {
  range?: Range;
  zoom?: number;
  onAddItem?: (date: Date) => void;
  children: ReactNode;
  className?: string;
  selectedDate?: Date; // 시간별 모드에서 사용할 날짜
};

export const GanttProvider: FC<GanttProviderProps> = ({
  zoom = 100,
  range = "monthly",
  onAddItem,
  children,
  className,
  selectedDate = new Date(), // 기본값은 오늘
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<TimelineData>(
    createInitialTimelineData(new Date())
  );
  const [timelyData, setTimelyData] = useState<TimelyData | undefined>();
  const [, setScrollX] = useGanttScrollX();
  const [sidebarWidth, setSidebarWidth] = useState(0);

  const headerHeight = 60;
  const rowHeight = 36;

  let columnWidth = 50;
  if (range === "monthly") {
    columnWidth = 150;
  } else if (range === "quarterly") {
    columnWidth = 100;
  } else if (range === "timely") {
    columnWidth = 60; // 시간별 뷰에서는 시간당 60px
  }

  // 시간별 데이터 초기화
  useEffect(() => {
    if (range === "timely") {
      setTimelyData(createTimelyData(selectedDate));
    } else {
      setTimelyData(undefined);
    }
  }, [range, selectedDate]);

  const cssVariables = useMemo(
    () =>
      ({
        "--gantt-zoom": `${zoom}`,
        "--gantt-column-width": `${(zoom / 100) * columnWidth}px`,
        "--gantt-header-height": `${headerHeight}px`,
        "--gantt-row-height": `${rowHeight}px`,
        "--gantt-sidebar-width": `${sidebarWidth}px`,
      }) as CSSProperties,
    [zoom, columnWidth, sidebarWidth]
  );

  useEffect(() => {
    if (scrollRef.current && range !== "timely") {
      scrollRef.current.scrollLeft =
        scrollRef.current.scrollWidth / 2 - scrollRef.current.clientWidth / 2;
      setScrollX(scrollRef.current.scrollLeft);
    }
  }, [setScrollX, range]);

  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebarElement = scrollRef.current?.querySelector(
        '[data-roadmap-ui="gantt-sidebar"]'
      );
      const newWidth = sidebarElement ? 300 : 0;
      setSidebarWidth(newWidth);
    };

    updateSidebarWidth();
    const observer = new MutationObserver(updateSidebarWidth);
    if (scrollRef.current) {
      observer.observe(scrollRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScroll = useCallback(
    throttle(() => {
      const scrollElement = scrollRef.current;
      if (!scrollElement || range === "timely") {
        return; // 시간별 모드에서는 무한 스크롤 비활성화
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
      setScrollX(scrollLeft);

      if (scrollLeft === 0) {
        const firstYear = timelineData[0]?.year;
        if (!firstYear) {
          return;
        }
        const newTimelineData: TimelineData = [...timelineData];
        newTimelineData.unshift({
          year: firstYear - 1,
          quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
            months: new Array(3).fill(null).map((_, monthIndex) => {
              const month = quarterIndex * 3 + monthIndex;
              return {
                days: getDaysInMonth(new Date(firstYear, month, 1)),
              };
            }),
          })),
        });
        setTimelineData(newTimelineData);
        scrollElement.scrollLeft = scrollElement.clientWidth;
        setScrollX(scrollElement.scrollLeft);
      } else if (scrollLeft + clientWidth >= scrollWidth) {
        const lastYear = timelineData.at(-1)?.year;
        if (!lastYear) {
          return;
        }
        const newTimelineData: TimelineData = [...timelineData];
        newTimelineData.push({
          year: lastYear + 1,
          quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
            months: new Array(3).fill(null).map((_, monthIndex) => {
              const month = quarterIndex * 3 + monthIndex;
              return {
                days: getDaysInMonth(new Date(lastYear, month, 1)),
              };
            }),
          })),
        });
        setTimelineData(newTimelineData);
        scrollElement.scrollLeft =
          scrollElement.scrollWidth - scrollElement.clientWidth;
        setScrollX(scrollElement.scrollLeft);
      }
    }, 100),
    [timelineData, setScrollX, range]
  );

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const scrollToFeature = useCallback(
    (feature: GanttFeature) => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) {
        return;
      }

      if (range === "timely" && timelyData) {
        const offset = getTimelyOffset(feature.startAt, timelyData.date, (columnWidth * zoom) / 100);
        scrollElement.scrollTo({
          left: Math.max(0, offset - scrollElement.clientWidth / 2),
          behavior: "smooth",
        });
      } else {
        const timelineStartDate = new Date(timelineData[0].year, 0, 1);
        const offset = getOffset(feature.startAt, timelineStartDate, {
          zoom,
          range,
          columnWidth,
          sidebarWidth,
          headerHeight,
          rowHeight,
          onAddItem,
          placeholderLength: 2,
          timelineData,
          timelyData,
          ref: scrollRef,
        });
        const targetScrollLeft = Math.max(0, offset);
        scrollElement.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    },
    [timelineData, timelyData, zoom, range, columnWidth, sidebarWidth, headerHeight, rowHeight, onAddItem]
  );

  return (
    <GanttContext.Provider
      value={{
        zoom,
        range,
        headerHeight,
        columnWidth,
        sidebarWidth,
        rowHeight,
        onAddItem,
        timelineData,
        timelyData,
        placeholderLength: 2,
        ref: scrollRef,
        scrollToFeature,
      }}
    >
      <div
        className={cn(
          "gantt relative h-full w-full flex-none select-none overflow-hidden rounded-sm bg-secondary",
          range,
          className
        )}
        ref={scrollRef}
        style={{
          ...cssVariables,
          display: 'grid',
          gridTemplateColumns: "var(--gantt-sidebar-width) 1fr",
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </GanttContext.Provider>
  );
};

export type GanttTimelineProps = {
  children: ReactNode;
  className?: string;
};

export const GanttTimeline: FC<GanttTimelineProps> = ({
  children,
  className,
}) => {
  const gantt = useContext(GanttContext);
  
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-auto",
        className
      )}
      style={{
        width: '100%',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <div 
        style={{
          width: gantt.range === "timely" && gantt.timelyData 
            ? `calc(24 * var(--gantt-column-width))`
            : 'max-content',
          height: '100%',
          position: 'relative',
          minWidth: gantt.range === "timely" ? 'auto' : 'max-content',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export type GanttTodayProps = {
  className?: string;
};

export const GanttToday: FC<GanttTodayProps> = ({ className }) => {
  const label = "지금";
  const date = useMemo(() => new Date(), []);
  const gantt = useContext(GanttContext);

  const offset = useMemo(() => {
    if (gantt.range === "timely" && gantt.timelyData) {
      return getTimelyOffset(date, gantt.timelyData.date, (gantt.columnWidth * gantt.zoom) / 100);
    }
    const differenceIn = getDifferenceIn(gantt.range);
    const timelineStartDate = new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1);
    return differenceIn(date, timelineStartDate);
  }, [gantt, date]);

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: gantt.range === "timely" 
          ? `translateX(${offset}px)`
          : `translateX(calc(var(--gantt-column-width) * ${offset}))`,
      }}
    >
      <div
        className={cn(
          "group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-red-500 text-white px-2 py-1 text-xs",
          className
        )}
      >
        {label}
        <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
          {gantt.range === "timely" 
            ? format(date, "HH:mm")
            : formatDate(date, "MMM dd, yyyy")
          }
        </span>
      </div>
      <div className={cn("h-full w-px bg-red-500", className)} />
    </div>
  );
};
