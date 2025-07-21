import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell
} from '@table-library/react-table-library/table';
import { useTheme } from "@table-library/react-table-library/theme";

export default function UserSkeleton() {
	const theme = useTheme([{
    Table: `--data-table-library_grid-template-columns: 11% 11% 18% 14% 11% repeat(3, minmax(0, 1fr)) 4% !important;`,
  }]);

	return (
		<div className='w-full h-full flex flex-col justify-start gap-4 py-4'>
			<div className='flex justify-end w-full px-4 lg:px-6 gap-2'>
				<Skeleton className="h-8 w-[70px]" />
				<Skeleton className="h-8 w-[70px]" />
			</div>
			<div className='w-full flex px-4 lg:px-6'>
				<Table
					theme={theme}
					className='w-full !h-auto border overflow-hidden rounded-lg'
					data={{ nodes: Array(12).fill({}) }} // Pass dummy data
					layout={{ fixedHeader: true }}
				>
					{(tableList: any[]) => (
						<>
							<Header>
								<HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
									<HeaderCell>이름</HeaderCell>
									<HeaderCell>ID</HeaderCell>
									<HeaderCell>Email</HeaderCell>
									<HeaderCell>생년월일</HeaderCell>
									<HeaderCell>소속</HeaderCell>
									<HeaderCell>음력여부</HeaderCell>
									<HeaderCell>유연근무제</HeaderCell>
									<HeaderCell>권한</HeaderCell>
									<HeaderCell></HeaderCell>
								</HeaderRow>
							</Header>
							<Body>
								{tableList.map((_, i) => (
									<Row
										key={i}
										item={{}} // Dummy item
										className='!bg-background [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2 [&_td]:!border-b'
									>
										<Cell>
											<div className='flex flex-row items-center'>
												<Skeleton className="h-8 w-8 rounded-full mr-1.5" />
												<Skeleton className="h-5 w-20" />
											</div>
										</Cell>
										<Cell><Skeleton className="h-5 w-24" /></Cell>
										<Cell><Skeleton className="h-5 w-40" /></Cell>
										<Cell><Skeleton className="h-5 w-32" /></Cell>
										<Cell><Skeleton className="h-5 w-20" /></Cell>
										<Cell><Skeleton className="h-5 w-10" /></Cell>
										<Cell><Skeleton className="h-6 w-24 rounded-md" /></Cell>
										<Cell><Skeleton className="h-5 w-20" /></Cell>
										<Cell><Skeleton className="h-8 w-8" /></Cell>
									</Row>
								))}
							</Body>
						</>
					)}
				</Table>
			</div>
		</div>
	);
}