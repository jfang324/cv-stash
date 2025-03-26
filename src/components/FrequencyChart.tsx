'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Briefcase, FileText } from 'lucide-react'
import { Line, LineChart, Tooltip, XAxis, type TooltipProps } from 'recharts'

interface FrequencyChartProps {
	data: Array<{ date: string; count: number }>
	dataType: 'applications' | 'resumes'
}

const chartConfig = {
	count: {
		label: 'Number of Applications',
		color: '#00B87C'
	}
} satisfies ChartConfig

export const FrequencyChart = ({ data, dataType }: FrequencyChartProps) => {
	const applications = data.map((item) => item.count)

	const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
		if (active && payload?.length && payload[0]) {
			return (
				<div className="bg-background border p-2 rounded-md shadow-sm text-sm">
					<p className="text-muted-foreground">{`Date: ${label}`}</p>
					<p className="text-primary font-bold">{`${
						dataType === 'applications' ? 'Applications' : 'Resumes'
					}: ${payload[0].value}`}</p>
				</div>
			)
		}

		return null
	}

	return (
		<Card className="w-full sm:flex-1">
			<CardHeader>
				<CardTitle>
					<div className="flex gap-2 items-center">
						{dataType === 'applications' ? (
							<Briefcase className="h-6 w-6" />
						) : (
							<FileText className="h-6 w-6" />
						)}
						<span className="font-bold">
							{dataType === 'applications' ? 'Job Application' : 'Resume Upload'} Frequency
						</span>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[200px] w-full">
					<LineChart data={data}>
						<XAxis dataKey="date" className="hidden" />
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey="count"
							name="count"
							stroke="black"
							strokeWidth={1.5}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
				<p className="text-muted-foreground text-sm pt-2">{`${applications.reduce((a, b) => a + b, 0)} ${
					dataType === 'applications' ? 'applications' : 'resumes'
				} in the last 30 days`}</p>
			</CardContent>
		</Card>
	)
}
